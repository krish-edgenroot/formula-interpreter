/**
 * @param {string} evalString
 * @param {any} args 
 */
exports.interpret = (evalString,...args) => {
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