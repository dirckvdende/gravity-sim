
import type { StateFile } from "@/filesystem/statefile.mjs";
import type { ObjectFile } from "../object";
import Vector2 from "@/util/linalg/Vector2";
import type { StyledGravityObject } from "@/sim/object";
import Vector3 from "@/util/linalg/Vector3";
import { svd } from "@/util/linalg/svd";
import Matrix from "@/util/linalg/Matrix";
import { projectToPlane } from "@/util/linalg/projectToPlane";
import Vector from "@/util/linalg/Vector";
import { objectIconFromName } from "./objectIcon";
import { zoomLevelCover } from "./zoomLevelCover";
import { ConversionError } from "./error";
import { getTimestamp } from "./timestamp";

/**
 * Convert a list of object files to a combined state file, by flattening coords
 * and converting to the proper data format
 * @param files Object files to convert. The generatorData fields of these
 * objects are modified to reflect generator info
 * @returns The converted state file
 * @throws ConversionError if conversion is not possible
 */
export function convertToStateFile(files: ObjectFile[]): StateFile {
    if (files.length < 1)
        throw new ConversionError("Cannot convert empty list of files")
    const timestamp = getTimestamp(files)
    const shifted = subtractCentoid(files)
    const normalVector = planeFit(shifted)
    const mappedToPlane = mapToPlane(shifted, normalVector)
    const objects = toGravityObjects(mappedToPlane)
    for (const [index, { generatorData }] of objects.entries())
        files[index]!.generatorData = generatorData
    return {
        icon: "./icons/moon.svg",
        name: "Horizons data import",
        objects: objects.map(({ object }) => object),
        position: Vector2.Zero,
        zoomLevel: zoomLevelCover(objects.map(({ object }) => object.position)),
        timestamp,
        speed: 1,
    }
}

/**
 * Subtract the centroid position from a list of object files such that the
 * output list of files will have its centroid at the origin
 * @param objects The list of file objects to center
 * @returns A copy of the list with shifted positions
 */
function subtractCentoid(files: ObjectFile[]): ObjectFile[] {
    if (files.length == 0)
        return []
    const points = files.map((file) => file.position)
    if (points.length < 3)
        for (const file of files)
            points.push(file.position.add(file.velocity))
    const centroid = points.reduce((prev, cur) => prev.add(cur),
        Vector3.Zero).scale(1 / points.length)
    return files.map((file) => ({
        ...file,
        position: file.position.subtract(centroid),
    }))
}

/**
 * Fit a plane to the positions of objects. If there is only one object, its
 * velocity is also taken into account
 * @param files Object files to fit the plane for
 * @returns The normal vector of the fitted plane
 */
function planeFit(files: ObjectFile[]): Vector3 {
    if (files.length == 0)
        throw new ConversionError("Cannot fit plane to zero objects")
    const points = files.map((file) => file.position)
    if (points.length < 2)
        points.push(files[0]!.velocity)
    const matrix = matrixFromColumns(points)
    // This matrix will have shape 3 x n with n >= 2
    const { u } = svd(matrix)
    const onb = Vector.orthonormalBasis(
        u.column(0),
        u.column(1),
        new Vector(1, 0, 0),
        new Vector(0, 1, 0),
        new Vector(0, 0, 1),
    )
    if (onb[2] == undefined)
        throw new ConversionError("Unexpected error while determining best "
            + "plane fit")
    return new Vector3(onb[2].get(0), onb[2].get(1), onb[2].get(2))
    
}

/**
 * Create a 3 x n matrix where its columns are given by a list of vectors
 * @param columns The columns of the matrix
 * @returns The generated matrix
 */
function matrixFromColumns(columns: Vector3[]): Matrix {
    return new Matrix(...columns.map((column) =>
        new Vector(column.x, column.y, column.z))).transpose()
}

/**
 * Map the velocities and positions of a list of objects to a plane
 * @param files The object files ot map to the plane
 * @param normalVector The normal vector of the plane, this is what is
 * "subtracted away"
 * @returns The list of object files with the mapped positions and velocities
 */
function mapToPlane(files: ObjectFile[], normalVector: Vector3): ObjectFile[] {
    const points: Vector3[] = []
    for (const file of files) {
        points.push(file.position)
        points.push(file.velocity)
    }
    const projectedPoints = projectToPlane(points, normalVector)
    return files.map((file, index) => {
        const position = projectedPoints[index * 2]!
        const velocity = projectedPoints[index * 2 + 1]!
        return { ...file, position, velocity }
    })
}

/**
 * Convert object files to gravity objects. The object files should have already
 * been mapped to a plane, such that their z-coords are removed and reported as
 * error metrics
 * @param files List of object files to convert. The generatorData properties of
 * these files are updated in-place
 * @returns The generated gravity objects, with generatorData results to be
 * given to the initial object files
 */
function toGravityObjects(files: ObjectFile[]): {
    object: StyledGravityObject,
    generatorData: ObjectFile["generatorData"],
}[] {
    // TODO: Use these
    const totalPosError = files.reduce((prev, cur) =>
        prev + Math.abs(cur.position.z), 0)
    const totalVelError = files.reduce((prev, cur) =>
        prev + Math.abs(cur.velocity.z), 0)
    return files.map((file, index) => {
        const positionError = Math.abs(file.position.z)
        const velocityError = Math.abs(file.velocity.z)
        return {
            generatorData: {
                positionError,
                velocityError,
                positionErrorRelative: totalPosError == 0 ? 0 :
                    positionError / totalPosError,
                velocityErrorRelative: totalVelError == 0 ? 0 :
                    velocityError / totalVelError,
            },
            object: {
                name: file.name,
                description: "",
                size: file.size,
                icon: objectIconFromName(file.name),
                id: index,
                position: new Vector2(file.position.x, file.position.y),
                velocity: new Vector2(file.velocity.x, file.velocity.y),
                mass: file.mass,
            }
        }
    })
}