
import type { StyledGravityObject } from "@/sim/object"

/** Deserialized form of a gravity sim state file */
export type StateFile = {
    /** URL of icon to display in menus where the file can be loaded in */
    icon: string
    /** Name to display in menus where the file can be loaded in */
    name: string
    /** List of gravity objects that are tracked */
    objects: StyledGravityObject[]
}