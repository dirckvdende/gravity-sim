
import Vector3 from "./Vector3";
import Matrix from "./Matrix";
import Vector from "./Vector";

/**
 * Project a list 3D points to a 2D plane given by a normal vector, and apply a
 * coordinate transform (x, y, z) => (x', y', z') such that x' and y' are the
 * coordinates of the point on the plane, and z' is the normal vector coordinate
 * @param points The points to project to the plane
 * @param normalVector The normal vector of the plane. This is the vector that
 * is "removed" from the input points
 * @returns The projected points (x', y', z') as described
 */
export function projectToPlane(points: Vector3[], normalVector: Vector3):
Vector3[] {
    const p = new Matrix(...Vector.orthonormalBasis(
        new Vector(normalVector.x, normalVector.y, normalVector.z),
        new Vector(1, 0, 0),
        new Vector(0, 1, 0),
        new Vector(0, 0, 1),
    )).transpose()
    if (p.shape[0] != 3 || p.shape[1] != 3)
        throw new Error(`Something went wrong while determining ` +
        `transformation matrix. Has shape ${p.shape}`)
    const pInverse = p.inverse()
    return points.map((point) => {
        const target = pInverse.multiply(new Vector(point.x, point.y, point.z))
        return new Vector3(target.get(1), target.get(2), target.get(0))
    })
}