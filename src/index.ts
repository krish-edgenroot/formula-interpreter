const fs = require("fs");

interface Interpretor{
    (evalString:string,libraries?:Array<string>|null,payload?:object):any
}
export const interpretor: Interpretor = (evalString,libraries,payload) => {
    try{
        let requiredLibraries = libraries?.map(ele=>`const ${ele} = require(__dirname+"/libraries/${ele}/index")`).join(";\n");
        if(requiredLibraries) requiredLibraries+=";"
        let externalArgs = Object.keys(payload||{})?.join(",");
        evalString = `(${externalArgs|| ""})=>{${requiredLibraries || ""} ${evalString}}`
        console.log("eval",evalString)
        let values = Object.values(payload||{}).map(ele=>{
            if(typeof ele == "object"){
                return JSON.stringify(ele)
            }
            if(typeof ele == "string"){
                return `\'${ele}\'`
            }
            return ele
    })
    let evalParser = eval(`(${evalString})`)
    return eval(`evalParser(${values?.toString()})`);
    }catch(err:any){
        console.log("Error:",err?.message)
    }
}

export const showLibAndProperties = (library?:string,propertyName?:string)=>{
    if(library){
        try{
            let functions = require(__dirname+"/libraries/"+library+"/definition");
            if(propertyName ){
                if(functions.hasOwnProperty(propertyName))
                    return functions[propertyName];
                else
                    throw Error("Error: Property not found")
            }
            else{    
                functions = Object.keys(functions)
                return functions;
            }
        }catch(err:any){
            console.log(err);
        }
    }
    else{
        let libraries = fs.readdirSync(__dirname+"/libraries");
        return libraries;
    }
}