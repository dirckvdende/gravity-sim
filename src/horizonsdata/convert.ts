
import type { StateFile } from "@/filesystem/statefile.mjs";
import type { ObjectFile } from "./object";
import Vector2 from "@/util/Vector2";
import type { StyledGravityObject } from "@/sim/object";
import Vector3 from "@/util/Vector3";
import { singularValueDecompose } from "./svd";
import { projectToPlane } from "./flatten";

export function convertToStateFile(objects: ObjectFile[]): StateFile | null {
    if (objects.length < 3)
        return null
    const flattened = flattenObjects(objects)
    for (const [index, object] of objects.entries())
        object.generatorData = {
            error: flattened[index]?.error ?? 0,
        }
    return {
        icon: "./icons/moon.svg",
        name: "Horizons data import",
        objects: flattened.map((value) => value.object),
        position: Vector2.Zero,
        zoomLevel: zoomLevelCover(flattened.map((value) =>
            value.object.position)),
        timestamp: new Date(Date.now()),
        speed: 1,
    }
}

function zoomLevelCover(points: Vector2[]): number {
    const PIXEL_RADIUS = 400
    const lengths = points.map((point) => point.length())
    const maxLength = Math.max(1, ...lengths)
    const pixelSize = maxLength / PIXEL_RADIUS
    return -Math.log(pixelSize)
}

function flattenObjects(objects: ObjectFile[]): {
    object: StyledGravityObject
    error: number
}[] {
    objects = subtractCentoid(objects)
    const positionMatrix: number[][] = []
    for (const object of objects)
        positionMatrix.push([object.position.x, object.position.y,
        object.position.z])
    const u = singularValueDecompose(positionMatrix)
    const normalVector = new Vector3(u[0]![2]!, u[1]![2]!, u[2]![2]!)
    const flattened = flattenToPlane(objects, normalVector)
    return flattened.map(({ object, error }, index) => ({
        error,
        object: {
            name: object.name,
            description: "",
            size: object.size,
            icon: "./icons/moon.svg",
            id: index,
            position: new Vector2(object.position.x, object.position.y),
            velocity: new Vector2(object.velocity.x, object.velocity.y),
            mass: object.mass,
        },
    }))
}

function subtractCentoid(objects: ObjectFile[]): ObjectFile[] {
    const centroid = objects.reduce((prev, cur) =>
        prev.add(cur.position), Vector3.Zero
    ).scale(1 / objects.length)
    return objects.map((object) => ({
        ...object,
        position: object.position.subtract(centroid),
    }))
}

function flattenToPlane(objects: ObjectFile[], normalVector: Vector3): {
    object: ObjectFile
    error: number
}[] {
    const points: Vector3[] = []
    for (const object of objects) {
        points.push(object.position)
        points.push(object.velocity)
    }
    const projectedPoints = projectToPlane(points, normalVector)
    return objects.map((object, index) => {
        const position = projectedPoints[index * 2]!
        const velocity = projectedPoints[index * 2 + 1]!
        const error = position.z + velocity.z
        return {
            object: { ...object, position, velocity },
            error,
        }
    })
}