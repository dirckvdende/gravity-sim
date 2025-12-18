
import type { StateFile } from "@/filesystem/statefile.mjs";
import type { ObjectFile } from "./object";
import Vector2 from "@/util/Vector2";

export function convertToStateFile(objects: ObjectFile[]): StateFile {
    // TODO: Implement
    return {
        icon: "",
        name: "",
        objects: [],
        position: Vector2.Zero,
        zoomLevel: 0,
        timestamp: new Date(Date.now()),
        speed: 1,
    }
}