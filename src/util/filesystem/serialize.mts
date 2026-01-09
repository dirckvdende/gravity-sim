
import Vector2 from "@/util/linalg/Vector2";
import type { StateFile } from "./statefile.mts";

/**
 * Custom serializer with support for Vector2, infinity, and dates
 * @param value The state to serialize
 * @returns The serialized state as a string
 */
export function serializeState(state: StateFile): string {
    // This is not good code, but JSON.stringify doesn't let you process dates
    // yourself because they already have a toJSON method... :(
    const dateToJSON = Date.prototype.toJSON
    // @ts-ignore
    Date.prototype.toJSON = undefined
    const result = JSON.stringify(state, (_key, value) => {
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
export function deserializeState(serialized: string): StateFile {
    // TODO: Implement error handling
    const r = JSON.parse(serialized, (_key, value) => {
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