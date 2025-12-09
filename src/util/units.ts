
/**
 * List of units for number to string formatting. This should be sorted in
 * ascending scale
 */
export type UnitsList = {
    /** Suffix to place after the number */
    suffix: string
    /** Scale of the unit compared to the base unit (e.g. km is 1000 m) */
    scale: number
}[]

/** Options to pass to a unit formatter */
export type FormatOptions = {
    /**
     * Minimum number of digits, before which scientific notation is used. A
     * negative number indicates a number of decimals after dot (default -3)
     */
    minDigits?: number
    /**
     * Maximum number of digits, after which scientific notation is used. A
     * negative number indicates a number of decimals after dot (default 3)
     */
    maxDigits?: number
    /** Thousands separator to use (if applicable, default " ") */
    thousandSeparator?: string
    /**
     * Number of significant digits to round to (default 3). When displaying a
     * large number, it is rounded to an integer instead
     */
    significance?: number
}

/**
 * Instructions for a formatted unit. This can be used to generate HTML or
 * plaintext
 */
type FormattedUnit = {
    /** Base number */
    base: string
    /** Power of ten to multiply base with (undefined means 0) */
    exponent?: string
    /** Unit suffix */
    suffix: string
}

/** Length units in meters and light years */
export const LENGTH_UNITS: UnitsList = [
    { suffix: "pm", scale: 1e-12 },
    { suffix: "nm", scale: 1e-9 },
    { suffix: "μm", scale: 1e-6 },
    { suffix: "mm", scale: 1e-3 },
    { suffix: "cm", scale: 1e-2 },
    { suffix: "m", scale: 1 },
    { suffix: "km", scale: 1000 },
    { suffix: "ly", scale: 9.461e15 },
]

/** Velocity units in meters per second and kilometers per second */
export const VELOCITY_UNITS: UnitsList = [
    { suffix: "m/s", scale: 1 },
    { suffix: "km/s", scale: 1000 },
]

/**
 * Find the best unit to use for the given value. This is the largest unit for
 * which the scale is is smaller than the value (or the smallest unit if this
 * doesn't exist)
 * @param value The value to find the unit for
 * @param units List of units
 * @returns The best unit as an item from the list of units
 */
function bestUnit(value: number, units: UnitsList): UnitsList[0] {
    if (units.length == 0)
        throw new Error("Units list cannot be empty")
    let i = 0
    while (i + 1 < units.length && units[i + 1]!.scale <= value)
        i++
    return units[i]!
}

/**
 * Round a number to some significance, or to the nearest integer if the number
 * of digits before the decimal point in the value is larger than the
 * significance
 * @param value The value to round
 * @param significance The significance to round to
 * @returns The rounded number as a string
 */
function roundToSignificance(value: number, significance: number): string {
    const digits = Math.floor(Math.log10(value)) + 1
    if (digits >= significance)
        return value.toFixed(0)
    return value.toFixed(Math.max(-20, significance - digits))
}

/**
 * Format a string by splitting it into parts of equal size (interval, with some
 * remainder added at the end) and joining the parts using a given separator
 * @param str The string to split up
 * @param sep The separator to use
 * @param interval The interval at which to place the separator
 * @param reverse Whether to start at the end of the input string (e.g. if
 * reverse=true the string "xxxx" with interval 3 would be split "x", "xxx".
 * With reverse=false it would be "xxx", "x")
 * @returns The formatted string
 */
function intervalInsert(str: string, sep: string, interval: number,
reverse: boolean = false): string {
    const start = reverse ? str.length % interval : 0
    let out = str.substring(0, start)
    for (let i = 0; i < str.length - start; i += interval) {
        if (i != 0 || start != 0)
            out += sep
        out += str.substring(i + start, i + start + interval)
    }
    return out
}

/**
 * Add thousand separators to a number
 * @param value The value to add thousand separators to as a string
 * @param sep The thousand separator to use (default " ")
 * @returns The value formatted with thousand separators
 */
function thousandsSep(value: string, sep: string = " "): string {
    const [front, back] = value.split(".")
    if (front === undefined)
        throw new Error("Unexpected undefined front of decimal point")
    return intervalInsert(front, sep, 3, true) + (back ?
        `.${intervalInsert(back, sep, 3, false)}` : "")
}

/**
 * Convert a value to an exponential format (scientific notation), if it is very
 * low or high. If this is for the case it is simply formatted with thousand
 * separators
 * @param value The value to format into exponential form
 * @param options Formatting options
 * @returns The base and (possible) exponent as formatted strings
 */
function exponentFormat(value: number, options: FormatOptions): {
    base: string
    exponent?: string
} {
    // Exponent when formatting with exponent, equal to number of digits minus 1
    const exponent = Math.floor(Math.log10(value))
    if (value < Math.pow(10, options.minDigits ?? -3)
    || value >= Math.pow(10, options.maxDigits ?? 3))
        // Format with exponent
        return {
            base: thousandsSep(
                roundToSignificance(
                    value / Math.pow(10, exponent),
                    options.significance ?? 3,
                ),
                options.thousandSeparator,
            ),
            exponent: String(exponent),
        }
    // Format without exponent
    return {
        base: thousandsSep(
            roundToSignificance(
                value,
                Math.min(
                    options.significance ?? 3,
                    -(options.minDigits ?? -3) + exponent + 1,
                ),
            ),
            options.thousandSeparator,
        ),
    }
}

/**
 * Generate a format template for a value and a list of units. This picks a
 * suitable unit from the list and converts the value to this unit. Output
 * contains a base and (possible) exponent part, both of which are formatted
 * strings. These indicate a value of base*10^exponent
 * @param value The value to convert
 * @param units List of units to pick from
 * @param options Formatting options
 * @returns An object with information on how to format the given unit. The
 * actual formatting to a string happens in other functions such as unitToHTML
 */
function unitToFormat(value: number, units: UnitsList, options: FormatOptions):
FormattedUnit {
    const { suffix, scale } = bestUnit(value, units)
    const { base, exponent } = exponentFormat(value / scale, options)
    return { base, exponent, suffix }
}

/**
 * Format a numeric value to a suitable unit, possibly using scientific
 * notation. Output is an HTML-formatted string
 * @param value The value to format
 * @param units List of units to pick from
 * @param options Formatting options
 * @returns Formatted HTML string
 */
export function unitToHTML(value: number, units: UnitsList, options?:
FormatOptions): string {
    const { base, exponent, suffix } = unitToFormat(value, units, options ?? {})
    if (exponent)
        return `${base} × 10<sup>${exponent}</sup> ${suffix}`
    return `${base} ${suffix}`
}