
/**
 * Check if there is an exponent of the form "10^{exp}" in a string
 * @param text The text to search through
 * @returns The exponent as a number, and zero if there is no exponent
 */
export function findExponent(text: string): number {
    const index = text.indexOf("10^")
    if (index == -1)
        return 0
    return findNumber(text.substring(index + 3))
}

/**
 * Scan the start of a string for a number and return it. Only the first number
 * is returned
 * @param text The text to scan
 * @returns The first number found, or zero if there is no number
 */
export function findNumber(text: string): number {
    const regex = /^\s*[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?/g
    const match = text.match(regex)
    if (!match || !match[0])
        return 0
    const num = match[0]
    return Number.isNaN(Number(num)) ? 0 : Number(num)
}