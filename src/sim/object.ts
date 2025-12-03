
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
}