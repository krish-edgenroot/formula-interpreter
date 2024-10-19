const path = require("path");

function functionParser(
  evalString: string,
  libraries: string[] | undefined | null
) {
  if (libraries) {
    let funcs = require(path.join(__dirname, "/funcMapping.json"));
    libraries.forEach((lib: string) => {
      for (const key in funcs[lib]) {
        let rgx = new RegExp(key, "g");
        evalString = evalString.replace(rgx, funcs[lib][key]);
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
// console.log(process.argv);
let nonValueArgs = ["undefined","null","[]","{}"]
let evalString = process.argv[2];
let libraries = nonValueArgs.includes(process.argv[3])?[]:process.argv[3].split(",");
let EXTERNAL_VAR = nonValueArgs.includes(process.argv[4])?{}:JSON.parse(process.argv[4]);

  if (process.send) {
    try {
      evalString = cleanEvalString(evalString);
      let requiredLibraries = libraries
        ?.map(
          (ele:any) => `const ${ele} = require(__dirname+"/libraries/${ele}/index")`
        )
        .join(";\n");
      if (requiredLibraries) requiredLibraries += ";";
      evalString = `(EXTERNAL_VAR)=>{${requiredLibraries || ""} ${evalString}}`;
      evalString = functionParser(evalString, libraries);
      let evalParser = eval(`(${evalString})`);
      let resp = eval(`evalParser(EXTERNAL_VAR)`) ;
      process.send({status:1,data:resp});
    } catch (err: any) {
      let errorLine = err?.stack?.match(/<anonymous>:(\d+):(\d+)/) 
      if(errorLine){
        errorLine = errorLine[0]?.split(":");
        let errorString= evalString.split("\n");
        let errorContext = errorString[errorLine[1]-1];
        process.send({
                status: 0,
                error: err.message,
                highlight: `>> ${errorContext}`, // Show error with pointer
          });
      }else{
        process.send({
          status: 0,
          error: err.message,
    });
      }
    }
  }
