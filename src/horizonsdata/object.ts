
import Vector3 from "@/util/Vector3"

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
 * @returns The deserialized object file
 */
export function deserializeObjectFile(text: string): ObjectFile {
    console.log(text)
    console.log(physicalProperties(text))
    // TODO: Implement
    return {
        name: "test",
        filename: "test.txt",
        position: Vector3.Zero,
        velocity: Vector3.Zero,
        mass: 100,
        size: 100,
    }
}

function physicalProperties(text: string): Map<string, string> {
    return new Map()
}