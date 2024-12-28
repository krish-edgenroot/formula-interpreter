export interface Sum {
    (...args: number[]): number;
}

export interface Round {
    (number: number, numDigits: number): number;
}

export interface Int {
    (number: number): number;
}