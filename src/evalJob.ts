const path = require("path");

function functionParser(
  evalString: string,
  libraries: string[] | undefined | null
) {
  if (libraries) {
    let funcs = require(path.join(__dirname, "/funcMapping.json"));
    libraries.forEach((lib: string) => {
      // Use the full name for the regex to ensure we match correctly
      for (const key in funcs[lib]) {

        let rgx = new RegExp(`\\b${key}\\b`, "g");
        evalString = evalString.replace(rgx, `${lib}.${key}`);
      }
    });
  }
  return evalString;
}

function cleanEvalString(evalString: string) {
  let requireRegx =
    /(const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)\s*;?/g;
  return evalString.replace(requireRegx, "");
}

function parseExternalVar(EXTERNAL_VAR: any) {
  let externalVarKeys = Object.keys(EXTERNAL_VAR);
  let funcsArr = externalVarKeys.map((key: string) => {
    if (typeof EXTERNAL_VAR[key] === "object" && EXTERNAL_VAR[key].hasOwnProperty("type") && EXTERNAL_VAR[key].type === "FUNCTION")
      return key;
  })
  for (const key in EXTERNAL_VAR) {
    if (typeof EXTERNAL_VAR[key] === "object" && EXTERNAL_VAR[key].hasOwnProperty("type") && EXTERNAL_VAR[key].type === "FUNCTION") {
      funcsArr.forEach(func => {
        if (func !== key) {
          EXTERNAL_VAR[key].value = EXTERNAL_VAR[key].value.replace(new RegExp(`${func}\\(`, 'g'), `EXTERNAL_VAR.${func}(`);
        }
      })
      EXTERNAL_VAR[key] = eval(EXTERNAL_VAR[key].value);
    }
  }
  return EXTERNAL_VAR;
};

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function extractCalculations(expression: string, EXTERNAL_VAR: any) {
  const steps = [];
  const context = { ...EXTERNAL_VAR };
  // remove wrapping arrow function if present
  expression = expression.replace(/^\(\s*EXTERNAL_VAR\s*\)\s*=>\s*{/, '').replace(/}$/, '').trim();
  expression = expression.replace(/^\s*\/\/.*$/gm, '');


  // 1️⃣ Extract all EXTERNAL_VAR.CODE properties used
  const varMatches = [...expression.matchAll(/EXTERNAL_VAR\.CODE\.([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)/g)];
  const uniqueVars = [...new Set(varMatches.map(m => m[1]))];

  uniqueVars.forEach(key => {
    // const value = EXTERNAL_VAR.CODE[key];
    const value = getNestedValue(EXTERNAL_VAR.CODE, key);

    steps.push(`${key} = ${value}`);
    context[key] = value; // save in context for later calculations
  });
  // 2️⃣ Handle variable declarations
  const statements = expression
    .split(/;(?![^(]*\))/) // split by semicolon but ignore semicolons inside parentheses
    .map(s => s.trim())
    .filter(Boolean);

  for (let stmt of statements) {
    const match = stmt.match(/^\s*(const|let|var)\s+(\w+)\s*=\s*([\s\S]+)$/);
    if (!match) continue;
    if (match) {
      const varName = match[2];
      const varExpr = match[3];
      const func = new Function("EXTERNAL_VAR", "context", `with(context) { return ${varExpr}; }`);

      const value = func(EXTERNAL_VAR, context);

      context[varName] = value;
      steps.push(`${varName} = ${varExpr} => ${value}`);
    }
  }

  // 3️⃣ Handle return statement
  //   const returnMatch = expression.match(/return\s+(.*);/);
  // 3️⃣ Handle return statement
  const returnMatch = expression.match(/return\s+([\s\S]+)$/m);
  if (returnMatch) {
    let returnExpr = returnMatch[1].trim();

    // remove trailing closing brace if present
    if (returnExpr.endsWith("}")) {
      returnExpr = returnExpr.slice(0, -1).trim();
    }

    const func = new Function("EXTERNAL_VAR", "context", `with(context) { return ${returnExpr}; }`);
    const finalValue = func(EXTERNAL_VAR, context);
    steps.push(`return ${returnExpr} = ${finalValue}`);
  }
  return steps;
}


process.on('disconnect', () => process.exit(1));
process.on('SIGTERM', () => process.exit(1));
process.on('uncaughtException', err => {
  if (process.send) process.send({ status: 0, error: err.message });
  process.exit(1);
});
process.on('unhandledRejection', (err: any) => {
  if (process.send) process.send({ status: 0, error: err.message });
  process.exit(1);
});

process.on('message', (data: any) => {
  let evalString = data.evalString;
  let libraries = data.libraries;
  let EXTERNAL_VAR = data.EXTERNAL_VAR;
  if (process.send) {
    try {
      evalString = cleanEvalString(evalString);
      let requiredLibraries = libraries
        ?.map(
          (ele: any) => `const ${ele} = require(__dirname + "/libraries/${ele}/index")`
        )
        .join(";\n");
      if (requiredLibraries) requiredLibraries += ";";
      evalString = `(EXTERNAL_VAR) => { ${requiredLibraries || ""}\n${evalString}\n}`;
      evalString = functionParser(evalString, libraries);
      let evalParser = eval(`(${evalString})`);
      EXTERNAL_VAR = parseExternalVar(EXTERNAL_VAR);
      let resp = evalParser(EXTERNAL_VAR);
      const vars = extractCalculations(evalString, EXTERNAL_VAR);

      process.send({ status: 1, data: resp, calculation: vars });
      process.exit(0);
    } catch (err: any) {
      let errorLine = err?.stack?.match(/<anonymous>:(\d+):(\d+)/g);
      if (errorLine) {
        errorLine = errorLine.at(-1)?.split(":");
        let errorString = evalString.split("\n");
        let errorContext = errorString[errorLine[1] - 1];
        process.send({
          status: 0,
          error: err.message,
          highlight: `>> ${errorContext}`,
        });
        process.exit(1);
      } else {
        process.send({
          status: 0,
          error: err.message,
        });
        process.exit(1);
      }
    }
  }
});
