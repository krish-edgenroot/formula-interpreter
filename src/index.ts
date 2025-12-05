const fs = require("fs");
const {fork} = require("child_process");
const path = require("path");

export function interpretor(
  evalString: string,
  libraries?: Array<string> | null,
  EXTERNAL_VAR?: {[key:string]:any}| null,
  options?: { timeout: number, memoryInMB:number }
): Promise<any> {
  return new Promise((resolve) => {
    let fileList = fs.readdirSync(__dirname);
    let fileName = fileList.includes("evalJob.ts")?"evalJob.ts":"evalJob.js"
    const childPath = path.join(__dirname, fileName);
    if(EXTERNAL_VAR){
      for(let key in EXTERNAL_VAR){
        if(typeof EXTERNAL_VAR[key] ==="function"){
          EXTERNAL_VAR[key] = {type:"FUNCTION",value:"("+EXTERNAL_VAR[key].toString()+")"};
        }
      }
    }
    const child = fork(childPath,[],{execArgv: [`--max-old-space-size=${options?.memoryInMB || 10}`]});

    let largeData = {
      evalString:evalString||"return null", 
      libraries:libraries||[], 
      EXTERNAL_VAR: EXTERNAL_VAR||{}
    }

    child.send(largeData);
    const timeOutID = setTimeout(() => {
      if (!child.killed) child.kill("SIGKILL"); // Terminate the child process
      resolve({
        status: 0,
        error: 'Timed out',})
    }, options?.timeout||5000);

    // Listen for a message from the child process
    child.on('message', (data: any) => {
      clearTimeout(timeOutID); // Clear the timeout
      if (!child.killed) child.kill("SIGTERM");
      resolve(data);           // Resolve the promise with the result
    });

    // if child crashes or exits without message
    child.on("exit", (code:number, signal:string) => {
      clearTimeout(timeOutID);
      if (signal !== "SIGTERM" && signal !== "SIGKILL") {
        resolve({ status: 0, error: `Child exited unexpectedly (code: ${code}, signal: ${signal})` });
      }
    });

    child.on("error", (err:any) => {
      clearTimeout(timeOutID);
      child.kill("SIGKILL");
      resolve({ status: 0, error: `Child error: ${err.message}` });
    });
  });
}

export function showLibAndProperties(
  library?: string | null,
  propertyName?: string | null,
  allAtOnce?: boolean
) {
  if (library) {
    try {
      let functions = require(__dirname +
        "/libraries/" +
        library +
        "/definition");
      if (propertyName) {
        if (functions.hasOwnProperty(propertyName))
          return functions[propertyName];
        else throw Error("LibProperty: Property not found");
      } else {
        functions = Object.keys(functions);
        return { status: 1, data: functions };
      }
    } catch (err: any) {
      return { status: 0, error: err };
    }
  } else {
    let libraries = fs.readdirSync(__dirname + "/libraries");
    let mapping: any = {};
    if (allAtOnce) {
      libraries.forEach((library: string) => {
        let functions = require(__dirname +
          "/libraries/" +
          library +
          "/definition");
        mapping[library] = functions;
      });
      libraries = mapping;
    }
    return libraries;
  }
}
