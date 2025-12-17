
import Vector3 from "@/util/Vector3"
import { physicalProperties, physicalPropertyValues } from "./physicalproperties"

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
    console.log(properties)
    // TODO: Implement
    return {
        name: objectName(text),
        filename,
        position: Vector3.Zero,
        velocity: Vector3.Zero,
        mass: properties.mass ?? 0,
        size: properties.size ?? 0,
    }
}

function objectName(text: string): string {
    for (const line of text.split("\n"))
        if (line.startsWith("Target body name:"))
            return line.substring(17).split(/\(|\{/gi)[0]!
    return "Imported body"
}
