
/**
 * Get the physical properties listed in a Horizons text file
 * @param text Horizons text file
 * @returns Map with entry names (anything before "=") to values (anthing after
 * "=") as strings
 */
export function physicalProperties(text: string): Map<string, string> {
    const dataLines = getDataLines(text)
    const splitIndex = getSplitIndex(dataLines)
    const textEntries: string[] = []
    for (const line of dataLines)
        textEntries.push(
            line.substring(0, splitIndex),
            line.substring(splitIndex),
        )
    return getEntries(textEntries)
}

/**
 * Extract physical property values that are stored in the ObjectFile type
 * @param properties The physical properties as a map from keys to values
 * @returns An object with physical property values. Properties may be missing
 * if they could not be found in the properties map
 */
export function physicalPropertyValues(properties: Map<string, string>): {
    mass?: number
    size?: number
} {
    let mass: number | undefined = undefined
    let size: number | undefined = undefined
    for (const [key, value] of properties.entries()) {
        const exp = findExponent(key) + findExponent(value)
        const num = findNumber(value)
        const trueValue = num * Math.pow(10, exp)
        if (key.includes("mass"))
            mass ??= trueValue
        // Radius/diameter is given in km by default
        if (key.includes("radius"))
            size ??= trueValue * 2000
        if (key.includes("diameter"))
            size ??= trueValue * 1000
    }
    return { mass, size }
}

/**
 * Check if there is an exponent of the form "10^{exp}" in a string
 * @param text The text to search through
 * @returns The exponent as a number, and zero if there is no exponent
 */
function findExponent(text: string): number {
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
function findNumber(text: string): number {
    let started = false
    let content = ""
    for (const char of text) {
        if ("0123456789.".indexOf(char) != -1 || (!started && char == "-")) {
            started = true
            content += char
        } else if (started) {
            break
        }
    }
    const num = Number(content)
    return Number.isNaN(num) ? 0 : num
}

/**
 * Get all lines that contain physical properties
 * @param text Horizons text file
 * @returns The physical property lines as an array of strings
 */
function getDataLines(text: string): string[] {
    let inSection = false
    const lines = text.split("\n").map((line) => line.toLowerCase())
    const dataLines: string[] = []
    for (const line of lines) {
        const startSpace = line.length - line.trimStart().length
        if (line.includes("physical") && line.includes("data")) {
            inSection = true
            continue
        }
        if (startSpace > 2 || line.trim() == "") {
            inSection = false
            continue
        }
        if (!inSection)
            continue
        dataLines.push(line)
    }
    return dataLines
}

/**
 * Get the splitting index between the columns in a list of lines containing
 * physical properties. It is assumed there are two columns
 * @param dataLines Lines containing physical properties
 * @returns Splitting index
 */
function getSplitIndex(dataLines: string[]): number {
    if (dataLines[0] == undefined)
        return 0
    let indices: number[] = []
    for (let i = 0; i < dataLines[0].length; i++)
        indices.push(i)
    for (const line of dataLines) {
        const candidates = candidateSplitIndices(line)
        indices = indices.filter((value) => candidates.indexOf(value) != -1)
    }
    return indices[0] ?? 0
}

/**
 * Determine possible column split indices in a given line containing physical
 * properties
 * @param dataLine The line to scan
 * @returns List of numbers: the candidate split indices
 */
function candidateSplitIndices(dataLine: string): number[] {
    const startSpace = dataLine.length - dataLine.trimStart().length
    const endSpace = dataLine.trimEnd().length
    const candidates: number[] = []
    for (const [index, char] of dataLine.split("").entries()) {
        const prev = dataLine[index - 1]
        const next = dataLine[index + 1]
        // Make sure that:
        // - Character is a space
        // - Space is not at the start
        // - Space is not at the end
        // - Space is not immediately preceded or succeded by "="
        if (char == " " && index >= startSpace && index < endSpace
        && prev != "=" && next != "=")
            candidates.push(index)
    }
    return candidates
}

/**
 * Convert list of physical properties as strings containing a "=" as separator
 * to a map
 * @param textEntries Textual representation of entries, containing a "=" that
 * separates key and value
 * @returns Map from keys to values
 */
function getEntries(textEntries: string[]): Map<string, string> {
    const entries = new Map<string, string>()
    for (const textEntry of textEntries) {
        const [keyString, valueString] = textEntry.split("=")
        const key = keyString?.trim()
        const value = valueString?.trim()
        if (!key || !value)
            continue
        entries.set(key, value)
    }
    return entries
}
