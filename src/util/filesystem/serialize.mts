
import Vector2 from "@/util/linalg/Vector2";
import Vector3 from "@/util/linalg/Vector3";
import type { StateFile } from "./statefile.mts";
import schemaObject from "@/assets/json/save.schema.json";
import { type JSONSchemaType } from "ajv";
import Ajv2020 from "ajv/dist/2020";
import type { SerializedSave, SerializedObject, SerializedVector2,
    SerializedVector3 } from "./serializedSave";
import type { StyledGravityObject } from "../sim/object";

/** Typed schema import */
const schema = schemaObject as any as JSONSchemaType<SerializedSave>

/**
 * Custom serializer with support for Vector2, infinity, and dates
 * @param value The state to serialize
 * @returns The serialized state as a string
 */
export function serializeState(state: StateFile): string {
    return JSON.stringify(serializeSave(state))
}

/**
 * Serialize a save
 * @param save The save to serialize
 * @returns The serialized save
 */
function serializeSave(save: StateFile): SerializedSave {
    return {
        icon: save.icon,
        name: save.name,
        objects: save.objects.map(serializeObject),
        position: serializeVector2(save.position),
        zoomLevel: save.zoomLevel,
        timestamp: save.timestamp.getTime(),
        speed: save.speed,
    }
}

/**
 * Serialize a gravity object
 * @param object The object to serialize
 * @returns The serialized gravity object
 */
function serializeObject(object: StyledGravityObject): SerializedObject {
    return {
        id: object.id,
        position: serializeVector3(object.position),
        velocity: serializeVector3(object.velocity),
        mass: object.mass,
        name: object.name,
        description: object.description,
        size: object.size,
        icon: object.icon,
    }
}

/**
 * Serialize a Vector2
 * @param vector The vector to serialize
 * @returns The serialized vector
 */
function serializeVector2(vector: Vector2): SerializedVector2 {
    return { x: vector.x, y: vector.y }
}

/**
 * Serialize a Vector3
 * @param vector The vector to serialize
 * @returns The serialized vector
 */
function serializeVector3(vector: Vector3): SerializedVector3 {
    return { x: vector.x, y: vector.y, z: vector.z }
}

/**
 * Custom deserializer with support for Vector2, infinity, and dates
 * @param value The state to deserialize as a string
 * @returns Deserialized state as an object
 */
export function deserializeState(serialized: string): StateFile {
    // TODO: May need to support Infinity
    const ajv = new Ajv2020()
    const validate = ajv.compile(schema)
    const parsed = JSON.parse(serialized)
    if (!validate(parsed))
        throw new Error(`Invalid file format. Validator threw these errors: ` +
        `${ajv.errorsText(validate.errors)}`)
    return deserializeSave(parsed)
}

/**
 * Deserialize a save to a state file
 * @param save The save to deserialize
 * @returns The state file
 */
function deserializeSave(save: SerializedSave): StateFile {
    return {
        icon: save.icon,
        name: save.name,
        objects: save.objects.map(deserializeObject),
        position: deserializeVector2(save.position),
        zoomLevel: save.zoomLevel,
        timestamp: new Date(save.timestamp),
        speed: save.speed,
    }
}

/**
 * Deserialize a gravity object
 * @param object The object to deserialize
 * @returns The deserialized gravity object
 */
function deserializeObject(object: SerializedObject): StyledGravityObject {
    return {
        id: object.id,
        position: deserializeVector3(object.position),
        velocity: deserializeVector3(object.velocity),
        mass: object.mass,
        name: object.name,
        description: object.description ?? "",
        size: object.size,
        icon: object.icon,
    }
}

/**
 * Deserialize a Vector2
 * @param vector The vector to deserialize
 * @returns The deserialized vector
 */
function deserializeVector2(vector: SerializedVector2): Vector2 {
    return new Vector2(vector.x ?? 0, vector.y ?? 0)
}

/**
 * Deserialize a Vector3
 * @param vector The vector to deserialize
 * @returns The deserialized vector
 */
function deserializeVector3(vector: SerializedVector3): Vector3 {
    return new Vector3(vector.x ?? 0, vector.y ?? 0, vector.z ?? 0)
}