
import Vector2 from "@/util/linalg/Vector2"

/** 3D position in space */
export default class Vector3 {

    // Zero vector
    static get Zero() { return new Vector3(0, 0, 0) }

    // Coordinates
    readonly x: number
    readonly y: number
    readonly z: number

    /**
     * Constructor
     * @param obj Object with x and y coordinates
     */
    constructor(obj: {x: number, y: number, z: number})
    /**
     * Constructor
     * @param x The x coordinate
     * @param y The y coordinate
     * @param z The z coordinate
     */
    constructor(x: number, y: number, z: number)
    constructor(objOrX: {x: number, y: number, z: number} | number, y?: number,
    z?: number) {
        if (typeof objOrX == "object") {
            this.x = objOrX.x
            this.y = objOrX.y
            this.z = objOrX.z
            return
        }
        if (y == undefined || z == undefined)
            throw new Error(`Unexpected undefined y- or z-coord`)
        this.x = objOrX
        this.y = y
        this.z = z
    }

    /**
     * Get the length of this vector
     * @returns The length of the vector
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    /**
     * Add two vectors
     * @param other The other vector to add
     * @returns A new vector that is the two vectors added
     */
    add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
    }

    /**
     * Scale the vector and return the result
     * @param factor The scaling factors, can be negative
     * @returns The scaled vector
     */
    scale(factor: number): Vector3 {
        return new Vector3(this.x * factor, this.y * factor, this.z * factor)
    }

    /**
     * Subtract another vector from this vector
     * @param other The vector to subtract
     * @returns The current vector subtracted by the other vector
     */
    subtract(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z)
    }

    /**
     * Whether this is the zero vector
     * @returns A boolean indicating if this is the zero vector
     */
    isZero(): boolean {
        return this.x == 0 && this.y == 0 && this.z == 0
    }

    /**
     * Negate the vector, same as scale(-1)
     * @returns The negated vector
     */
    negate(): Vector3 {
        return this.scale(-1)
    }

    /**
     * Normalize the vector to be length 1
     * @returns The normalized vector, or the zero vector if the vector was
     * already zero
     */
    normalize(): Vector3 {
        if (this.isZero())
            return this
        return this.scale(1 / this.length())
    }

    /**
     * Find the distance to another vector
     * @param other The other vector
     * @returns The distance
     */
    distanceTo(other: Vector3): number {
        return this.subtract(other).length()
    }

    /**
     * Dot product between two vectors
     * @param other The other vector in the product
     * @return The value of the dot product
     */
    dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z
    }

    /**
     * Remove the z-coord from the vector
     * @returns The vector as a Vector2, with the z-coord dropped
     */
    flatten(): Vector2 {
        return new Vector2(this.x, this.y)
    }

}