
import Vector2 from "@/util/Vector2"

/** An object in the gravity sim, without visual info */
export type GravityObject = {
    /** Unique identifier to track object changes */
    id: number
    /** Position of the object */
    position: Vector2
    /** Velocity vector of the object */
    velocity: Vector2
    /** Mass of the object */
    mass: number
    /** Current force acting on the object. Automatically updated by sim */
    force?: Vector2
}

/**
 * Gravity object with style info, which isn't needed for simulation, but is for
 * display to the user
 */
export type StyledGravityObject = GravityObject & {
    /** Name of the object */
    name: string
    /** Size (diameter) of the object */
    size: number
    /** Object icon URL */
    icon: string
}