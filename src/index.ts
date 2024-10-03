const fs = require("fs");
const path = require("path");

function functionParser(evalString:string, libraries:string[]|undefined|null){
    if(libraries){
        let funcs = require(path.join(__dirname,"/funcMapping.json"));
        libraries.forEach((lib:string)=>{  
            for (const key in funcs[lib]) {
                let rgx = new RegExp(key,'g');
                evalString = evalString.replace(rgx,funcs[lib][key]);
            }
        })
    }
    return evalString;
}

function cleanEvalString(evalString:string){
    let requireRegx = /(const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)\s*;?/g;
    return evalString.replace(requireRegx,"");
}

export function interpretor(evalString:string,libraries?:Array<string>|null,payload?:object):any{
    try{
        evalString = cleanEvalString(evalString);
        let requiredLibraries = libraries?.map(ele=>`const ${ele} = require(__dirname+"/libraries/${ele}/index")`).join(";\n");
        if(requiredLibraries) requiredLibraries+=";"
        let externalArgs = Object.keys(payload||{})?.join(",");
        evalString = `(${externalArgs|| ""})=>{${requiredLibraries || ""} ${evalString}}`
        let values = Object.values(payload||{}).map(ele=>{
            if(typeof ele == "object"){
                return JSON.stringify(ele)
            }
            if(typeof ele == "string"){
                return `\'${ele}\'`
            }
            return ele
    })
    evalString = functionParser(evalString,libraries);
    let evalParser = eval(`(${evalString})`)
    return {status:1, result:eval(`evalParser(${values?.toString()})`)};
    }catch(err:any){
        return {status:0,error:err?.message}
    }
}

export function showLibAndProperties (library?:string|null,propertyName?:string|null,allAtOnce?:boolean) {
    if(library){
        try{
            let functions = require(__dirname+"/libraries/"+library+"/definition");
            if(propertyName ){
                if(functions.hasOwnProperty(propertyName))
                    return functions[propertyName];
                else
                    throw Error("LibProperty: Property not found")
            }
            else{    
                functions = Object.keys(functions)
                return {status:1,data:functions};
            }
        }catch(err:any){
            return {status:0,error:err};
        }
    }
    else{
        let libraries = fs.readdirSync(__dirname+"/libraries");
        let mapping:any = {};
        if(allAtOnce){
            libraries = libraries.map((library:string)=>{
                let functions = require(__dirname+"/libraries/"+library+"/definition");
                mapping[library] = functions;
            });
        }
        return mapping || libraries;
    }
}