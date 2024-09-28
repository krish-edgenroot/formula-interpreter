import * as Logical from './Logical';
export const IF: Logical.If = (condition,trueValue,falseValue)=>{
    return (condition)?trueValue:falseValue
}

export const AND: Logical.And = (...args)=>{
    return eval(args.join(' && '))
}

export const OR: Logical.Or = (...args)=>{
    return eval(args.join(' || '))
}