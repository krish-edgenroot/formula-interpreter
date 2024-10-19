const fs = require("fs");
const {fork} = require("child_process");


function waitForChildMessage(child: any,timeOutID: any): Promise<any> {
    return new Promise((resolve) => {
        child.on('message', (result:any) => {
            clearTimeout(timeOutID)
            resolve(result);
        });
    });
}

export function interpretor(
  evalString: string,
  libraries?: Array<string> | null,
  EXTERNAL_VAR?: object| null,
  options?: { timeout: number }
): Promise<any> {
  return new Promise((resolve) => {
    let fileList = fs.readdirSync(__dirname);
    let fileName = {
      "evalJob":fileList.includes("evalJob.ts")?"evalJob.ts":"evalJob.js"
    }
    const child = fork(__dirname+"/" + fileName.evalJob, [evalString, libraries, JSON.stringify(EXTERNAL_VAR)]);

    const timeOutID = setTimeout(() => {
      child.kill('SIGTERM'); // Terminate the child process
      resolve({
        status: 0,
        error: 'Timed out',})
    }, options?.timeout||2000);

    // Listen for a message from the child process
    child.on('message', (data: any) => {
      clearTimeout(timeOutID); // Clear the timeout
      resolve(data);           // Resolve the promise with the result
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
      libraries = libraries.map((library: string) => {
        let functions = require(__dirname +
          "/libraries/" +
          library +
          "/definition");
        mapping[library] = functions;
      });
    }
    return mapping || libraries;
  }
}
