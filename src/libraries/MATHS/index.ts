import * as Maths from './Maths';



export const SUM: Maths.Sum = (...args: number[]) => {
    if (!args.every(arg => typeof arg === 'number')) {
        throw new Error("SUM function only accepts numeric values.");
    }
    return args.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};


export const ROUND: Maths.Round = (number: number, numDigits: number) => {
    const factor = Math.pow(10, numDigits);
    return Math.round(number * factor) / factor;
}

export const INT: Maths.Int = (number: number) => {
    return Math.trunc(number);
};

