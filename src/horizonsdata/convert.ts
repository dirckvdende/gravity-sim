
import type { StateFile } from "@/filesystem/statefile.mjs";
import type { ObjectFile } from "./object";
import Vector2 from "@/util/linalg/Vector2";
import type { StyledGravityObject } from "@/sim/object";
import Vector3 from "@/util/linalg/Vector3";
import { svd } from "@/util/linalg/svd";
import Matrix from "@/util/linalg/Matrix";
import { projectToPlane } from "./flatten";
import Vector from "@/util/linalg/Vector";

export function convertToStateFile(objects: ObjectFile[]): StateFile | null {
    if (objects.length < 1)
        return null
    const flattened = flattenObjects(objects)
    for (const [index, object] of objects.entries())
        object.generatorData = {
            error: Math.abs(flattened[index]?.error ?? 0),
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
    const matrix = new Matrix(...positionMatrix).transpose()
    const { u } = svd(matrix)
    const onb = Vector.orthonormalBasis(
        u.column(0),
        u.column(1),
        new Vector(1, 0, 0),
        new Vector(0, 1, 0),
        new Vector(0, 0, 1),
    )
    const normalVector = onb[2]!
    const flattened = flattenToPlane(objects, new Vector3(
        normalVector.get(0),
        normalVector.get(1),
        normalVector.get(2),
    ))
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