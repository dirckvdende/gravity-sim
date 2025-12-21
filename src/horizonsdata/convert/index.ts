
import type { StateFile } from "@/filesystem/statefile.mjs";
import type { ObjectFile } from "../object";
import Vector2 from "@/util/linalg/Vector2";
import type { StyledGravityObject } from "@/sim/object";
import Vector3 from "@/util/linalg/Vector3";
import { svd } from "@/util/linalg/svd";
import Matrix from "@/util/linalg/Matrix";
import { projectToPlane } from "@/util/linalg/projectToPlane";
import Vector from "@/util/linalg/Vector";
import { iconList } from "@/filesystem/iconlist";

/**
 * Convert a list of object files to a combined state file, by flattening coords
 * and converting to the proper data format
 * @param objects Object files to convert
 * @returns The converted state file, or null if this failed
 */
export function convertToStateFile(objects: ObjectFile[]): StateFile | null {
    if (objects.length < 1)
        return null
    const flattened = flattenObjects(objects).map(({ error, object }) => ({
        error,
        object: setObjectIcon(object),
    }))
    const totalError = flattened.reduce((prev, { error }) =>
        prev + Math.abs(error), 0)
    for (const [index, object] of objects.entries())
        object.generatorData = {
            error: totalError == 0 || flattened[index]?.error == undefined
                ? 0
                : Math.abs(flattened[index].error / totalError),
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

/**
 * Find an icon to give to a gravity object based on its name. Icons are listed
 * in "/public/icons" and if no applicable icon can be found "moon.svg" is used
 * @param object The gravity object to set the icon of
 * @returns A copy of the gravity object with the icon replaced
 */
function setObjectIcon(object: StyledGravityObject): StyledGravityObject {
    let icon = "./icons/moon.svg"
    for (const iconFile of iconList()) {
        const split = iconFile.split("/")
        const iconName = split[split.length - 1]!.split(".")[0]!
        if (object.name.toUpperCase().includes(iconName.toUpperCase()))
            icon = iconFile
    }
    return { ...object, icon }
}

/**
 * Find a zoom level that displays all of the given points (centered at the
 * origin) within a radius of 400 pixels
 * @param points The points to display
 * @returns The appropriate zoom level
 */
function zoomLevelCover(points: Vector2[]): number {
    const PIXEL_RADIUS = 400
    const lengths = points.map((point) => point.length())
    const maxLength = Math.max(1, ...lengths)
    const pixelSize = maxLength / PIXEL_RADIUS
    return -Math.log(pixelSize)
}

/**
 * Convert object files to gravity objects by flattening their coordinates to a
 * plane
 * @param objects The obejcts to flatten to styled gravity objects
 * @returns An array with the resulting objects and errors induced by flattening
 */
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

/**
 * Subtract the centroid position from a list of object files such that the
 * output list of files will have its centroid at the origin
 * @param objects The list of file objects to center
 * @returns A copy of the list with shifted positions
 */
function subtractCentoid(objects: ObjectFile[]): ObjectFile[] {
    const centroid = objects.reduce((prev, cur) =>
        prev.add(cur.position), Vector3.Zero
    ).scale(1 / objects.length)
    return objects.map((object) => ({
        ...object,
        position: object.position.subtract(centroid),
    }))
}

/**
 * Transform the coordinates of a list of objects (x, y, z) => (x', y', z'),
 * such that x' and y' will be the coordinates on the plane given by the input
 * normal vector, and z' is the distance of the initial coordinates to this
 * plane
 * @param objects List of object files to flatten
 * @param normalVector The normal vector of the plane
 * @returns An array with the resulting objects and errors (which are the
 * resulting z-coords)
 */
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