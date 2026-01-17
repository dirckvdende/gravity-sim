
/**
 * Unpacked JSON conforming with the JSON schema in
 * `@/assets/json/save.schema.json`
 */
export type SerializedSave = {
    icon: SerializedURL
    name: string
    objects: SerializedObject[]
    position: SerializedVector2
    zoomLevel: number
    timestamp: SerializedDate
    speed: number
}

export type SerializedObject = {
    id: number
    position: SerializedVector3
    velocity: SerializedVector3
    mass: number
    name: string
    description?: string
    size: number
    icon: SerializedURL
}

/** Serialized version of Vector2, non-present entries are set to zero */
export type SerializedVector2 = {
    x?: number
    y?: number
}

/** Serialized version of Vector3, non-present entries are set to zero */
export type SerializedVector3 = {
    x?: number
    y?: number
    z?: number
}

export type SerializedURL = string
export type SerializedDate = number