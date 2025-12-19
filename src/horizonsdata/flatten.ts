
import Vector3 from "@/util/linalg/Vector3";
import Matrix from "@/util/linalg/Matrix";
import Vector from "@/util/linalg/Vector";

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