export const formatNumber = (unFormattedNumber: number)=> {
    return unFormattedNumber.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}

export const getRideOfNullValues = (arrayOfNumbers: number[]) => {
    return arrayOfNumbers.filter(value=> value!=null)
}

export const sum = (arrayOfNumbers: number[]): number => {
    arrayOfNumbers = getRideOfNullValues(arrayOfNumbers);
    console.log('arrayOfNumbers', arrayOfNumbers)
    return arrayOfNumbers.reduce(
        (partialSum, a) => partialSum+a,
        0
    )
}
export const average = (arrayOfNumbers: number[]): number => {
    arrayOfNumbers = getRideOfNullValues(arrayOfNumbers);
    return arrayOfNumbers.length ? sum(arrayOfNumbers)/arrayOfNumbers.length : 0
}

/**
 * @param measureOfPart
 * @param measureOfAll
 *
 * @returns ratio: measureOfPart is ratio % of measureOfAll
 */
export const ratio = (measureOfPart: number, measureOfAll: number): number => {
    return measureOfAll==0 ? NaN : (1 - measureOfPart/measureOfAll) * 100;
}