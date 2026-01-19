
import type { StyledGravityObject } from "@/util/sim/object"
import type Vector2 from "@/util/linalg/Vector2"

/** Deserialized form of a gravity sim state file */
export type StateFile = {
    /** URL of icon to display in menus where the file can be loaded in */
    icon: string
    /** Name to display in menus where the file can be loaded in */
    name: string
    /** Description of the scenario */
    description: string
    /** List of gravity objects that are tracked */
    objects: StyledGravityObject[]
    /** Map camera position */
    position: Vector2
    /** Map zoom level */
    zoomLevel: number
    /** Timestamp of the sim */
    timestamp: Date
    /** Sim speed */
    speed: number
}