
import Vector3 from "@/util/linalg/Vector3";
import { Matrix, Vector } from "./Matrix";

export function projectToPlane(points: Vector3[], normalVector: Vector3):
Vector3[] {
    const p = new Matrix(...Vector.orthonormalBasis(
        new Vector(normalVector.x, normalVector.y, normalVector.z),
        new Vector(1, 0, 0),
        new Vector(0, 1, 0),
        new Vector(0, 0, 1),
    )).transpose()
    if (p.n != 3 || p.m != 3)
        throw new Error(`Something went wrong while determining ` +
        `transformation matrix. Has size ${p.n} x ${p.m}`)
    const pInverse = p.inverse()
    return points.map((point) => {
        const target = pInverse.multiply(new Vector(point.x, point.y, point.z))
        return new Vector3(target.entry(1), target.entry(2), target.entry(0))
    })
}