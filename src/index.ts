interface Interpretor{
    (evalString:string,...args:any):any
}
const interpret: Interpretor = (evalString,...args) => {
    args = args.map(ele=>{
        if(typeof ele == "object"){
            return JSON.stringify(ele)
        }
        if(typeof ele == "string"){
            return `\'${ele}\'`
        }
        return ele
    })
    let evalParser = eval(`(${evalString})`)
    return eval(`evalParser(${args.toString()})`);
}

module.exports = interpret;