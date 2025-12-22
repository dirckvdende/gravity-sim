
import Vector2 from "@/util/linalg/Vector2";
import type { StateTree } from "pinia";
import type { Serializer } from "pinia-plugin-persistedstate";

/**
 * Custom serializer with support for Vector2, infinity, and dates
 * @param value The state to serialize
 * @returns The serialized state as a string
 */
function serialize(value: StateTree): string {
    // This is not good code, but JSON.stringify doesn't let you process dates
    // yourself because they already have a toJSON method... :(
    const dateToJSON = Date.prototype.toJSON
    // @ts-ignore
    Date.prototype.toJSON = undefined
    const result = JSON.stringify(value, (_key, value) => {
        if (value === Infinity)
            return { $type: "infinity" }
        if (value instanceof Vector2)
            return { $type: "Vector2", x: value.x, y: value.y }
        if (value instanceof Date)
            return { $type: "Date", value: value.getTime() }
        return value
    })
    // Here we restore what we did before
    Date.prototype.toJSON = dateToJSON
    return result
}

/**
 * Custom deserializer with support for Vector2, infinity, and dates
 * @param value The state to deserialize as a string
 * @returns Deserialized state as an object
 */
function deserialize(value: string): StateTree {
    const r = JSON.parse(value, (_key, value) => {
        if (typeof value == "object" && typeof value.$type == "string") {
            switch (value.$type) {
                case "infinity": return Infinity
                case "Vector2": return new Vector2(value.x, value.y)
                case "Date": return new Date(value.value)
                default: throw new Error(`Unrecognized type ${value.$type}`)
            }
        }
        return value
    })
    return r
}

/**
 * Serializer that also handles custom used values such as Vector2 and Infinity
 */
export const serializer: Serializer = { serialize, deserialize }