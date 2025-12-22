
import Vector3 from "@/util/linalg/Vector3"

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
        positionError: number
        positionErrorRelative: number
        velocityError: number
        velocityErrorRelative: number
    }
}
