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

function parseExternalVar  (EXTERNAL_VAR: any)  {
  let externalVarKeys =  Object.keys(EXTERNAL_VAR);
  let funcsArr = externalVarKeys.map((key:string)=>{
    if(typeof EXTERNAL_VAR[key] === "object" && EXTERNAL_VAR[key].hasOwnProperty("type") && EXTERNAL_VAR[key].type === "FUNCTION")
      return key;
  })
  for (const key in EXTERNAL_VAR) {
    if (typeof EXTERNAL_VAR[key] === "object" && EXTERNAL_VAR[key].hasOwnProperty("type") && EXTERNAL_VAR[key].type === "FUNCTION") {
      funcsArr.forEach(func=>{
        if(func!==key){
          EXTERNAL_VAR[key].value = EXTERNAL_VAR[key].value.replace(`${func}(`,`EXTERNAL_VAR.${func}(`);
        }
      })
      EXTERNAL_VAR[key] = eval(EXTERNAL_VAR[key].value);
    }
  }
  return EXTERNAL_VAR;
};

// Handle command line arguments
let nonValueArgs = ["undefined", "null", "[]", "{}",""];
let evalString = process.argv[2];
let libraries = nonValueArgs.includes(process.argv[3]) ? [] : process.argv[3].split(",");
let EXTERNAL_VAR = nonValueArgs.includes(process.argv[4]) ? {} : JSON.parse(process.argv[4]);

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
    process.send({ status: 1, data: resp });
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
    } else {
      process.send({
        status: 0,
        error: err.message,
      });
    }
  }
}

