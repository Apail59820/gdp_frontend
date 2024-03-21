export const sum = (arrayOfNumbers: number[]): number => {
    return arrayOfNumbers.reduce(
        (partialSum, a) => partialSum+a,
        0
    )
}
export const average = (arrayOfNumbers: number[]): number => {
    return arrayOfNumbers.length ? sum(arrayOfNumbers)/arrayOfNumbers.length : 0
}
export const ratio = (measureOfPart, measureOfAll): number => {
    return measureOfAll==0 ? NaN : (1 - measureOfPart/measureOfAll) * 100;
}