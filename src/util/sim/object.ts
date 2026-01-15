
import Vector3 from "@/util/linalg/Vector3"

/** An object in the gravity sim, without visual info */
export type GravityObject = {
    /** Unique identifier to track object changes */
    id: number
    /** Position of the object */
    position: Vector3
    /** Velocity vector of the object */
    velocity: Vector3
    /** Mass of the object */
    mass: number
}

/**
 * Gravity object with style info, which isn't needed for simulation, but is for
 * display to the user
 */
export type StyledGravityObject = GravityObject & {
    /** Name of the object */
    name: string
    /** Object description */
    description: string
    /** Size (diameter) of the object */
    size: number
    /** Object icon URL */
    icon: string
}