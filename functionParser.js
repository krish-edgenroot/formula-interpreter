// run on every build
const fs = require("fs");
const args = process.argv; 
(()=>{
    let arguments = args.slice(2);
    let sourceFolder = "src";
    if(arguments.length > 0){
        if(arguments[0].includes("--src")){
            sourceFolder = arguments[0].split("=").at(-1)?.trim();
        }
    }
    let libraries = fs.readdirSync(__dirname+"/src/libraries");
    let mapping = {};
    libraries.forEach((lib)=>{
        const def = require(__dirname+"/src/libraries/"+lib+"/definition.ts");
        Object.keys(def).forEach((func)=>{
            if(mapping.hasOwnProperty(lib)){
                mapping[lib] = {
                    ...mapping[lib],
                   [func]: `${lib}.${func}`
                }
            }else{
                mapping[lib] = {
                   [func]: `${lib}.${func}`
                }
            }
        })
    })
    fs.writeFileSync(__dirname+`/${sourceFolder}/funcMapping.json`,JSON.stringify(mapping)); 
})()