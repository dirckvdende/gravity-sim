
import Vector3 from "@/util/Vector3"
import { physicalProperties, physicalPropertyValues } from "./physicalproperties"
import { findNumber } from "./scanstring"

/** Object representation of horizons exported file */
export type ObjectFile = {
    /** Name of the object */
    name: string
    /** Name of the uploaded file */
    filename: string
    /** Position of the object m/s */
    position: Vector3
    /** Velocity of the object in m/s */
    velocity: Vector3
    /** Mass of the object in kg */
    mass: number
    /** Size (diameter) of the object in meters */
    size: number
    /** Time at which object position and velocity are measured */
    time: Date
    /** Extra info added when the generator is run */
    generatorData?: {
        error: number
    }
}

/**
 * Deserialize an object file from text downloaded from the NASA Horizons system
 * to an object representation
 * @param text The text to deserialize
 * @param filename The filename of the file that is being deserialized (default
 * "unknown.txt")
 * @returns The deserialized object file
 */
export function deserializeObjectFile(text: string, filename: string =
"unknown.txt"): ObjectFile {
    const properties = physicalPropertyValues(physicalProperties(text))
    return {
        name: objectName(text),
        filename,
        mass: properties.mass ?? 0,
        size: properties.size ?? 0,
        ...objectStateVector(text),
    }
}

/**
 * Find the object name from the Horizons file
 * @param text The Horizons file text
 * @returns The name of the object. If nothing could be found "Imported body" is
 * returned
 */
function objectName(text: string): string {
    for (const line of text.split("\n"))
        if (line.startsWith("Target body name:"))
            return line.substring(17).split(/\(|\{/gi)[0]!
    return "Imported body"
}

/**
 * Find the state vector (time, 3D positionm and 3D velocity) from the Horizons
 * file
 * @param text The Horizons file text
 * @returns An object with the found time, position, and velocity. Defaults are
 * the current time, zero position, and zero velocity
 */
function objectStateVector(text: string): {
    time: Date
    position: Vector3
    velocity: Vector3
} {
    let linesSinceSOE = -1
    let time = new Date()
    let position = Vector3.Zero
    let velocity = Vector3.Zero
    for (const line of text.split("\n")) {
        if (line.startsWith("$$SOE"))
            linesSinceSOE = 0
        if (linesSinceSOE == 1)
            time = new Date(tdbToDate(findNumber(line.trim())))
        if (linesSinceSOE > 1) {
            const trimmed = line.trim()
            if (trimmed.startsWith("X =")) {
                const x = findNumber(trimmed.substring(3))
                const yStart = trimmed.indexOf("Y =") + 3
                const y = findNumber(trimmed.substring(yStart))
                const zStart = trimmed.indexOf("Z =") + 3
                const z = findNumber(trimmed.substring(zStart))
                position = new Vector3(x, y, z)
            }
            if (trimmed.startsWith("VX=")) {
                const vx = findNumber(trimmed.substring(4))
                const vyStart = trimmed.indexOf("VY=") + 4
                const vy = findNumber(trimmed.substring(vyStart))
                const vzStart = trimmed.indexOf("VZ=") + 4
                const vz = findNumber(trimmed.substring(vzStart))
                velocity = new Vector3(vx, vy, vz)
            }
        }
        if (linesSinceSOE >= 3)
            break
        if (linesSinceSOE >= 0)
            linesSinceSOE++
    }
    return { time, position, velocity }
}

/**
 * Convert a TDB datetime as used in the Horizons output to a JS Date object
 * @param value The datetime (in days since TDB epoch)
 * @returns The converted Date object
 */
function tdbToDate(value: number): Date {
    return new Date(value * 24 * 60 * 60 * 1000 - 210_866_760_000_000)
}
