
import Vector2 from "@/util/Vector2"

/**
 * An object in the gravity sim
 */
export type GravityObject = {
    /** Position of the object */
    position: Vector2,
    /** Velocity vector of the object */
    velocity: Vector2,
    /** Mass of the object */
    mass: number,
    /** Size (diameter) of the object */
    size: number,
    /** Icon used to display the object */
    icon: string,
}