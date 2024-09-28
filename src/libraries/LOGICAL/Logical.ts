export interface If {
    (condition: any,trueValue: any,falseValue: any): any
}
export interface And {
    (...args: any): boolean
}
export interface Or {
    (...args: any): boolean
}