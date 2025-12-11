
/**
 * 2D position in space
 */
export default class Vector2 {

    // Zero vector
    static get Zero() { return new Vector2(0, 0) }

    // Coordinates
    readonly x: number
    readonly y: number

    /**
     * Constructor
     * @param obj Object with x and y coordinates
     */
    constructor(obj: {x: number, y: number})
    constructor(x: number, y: number)
    constructor(objOrX: {x: number, y: number} | number, y?: number) {
        if (typeof objOrX == "object") {
            this.x = objOrX.x
            this.y = objOrX.y
            return
        }
        if (y == undefined)
            throw new Error(`Unexpected undefined y-coord`)
        this.x = objOrX
        this.y = y
    }

    /**
     * Get the length of this vector
     * @returns The length of the vector
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    /**
     * Add two vectors
     * @param other The other vector to add
     * @returns A new vector that is the two vectors added
     */
    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y)
    }

    /**
     * Scale the vector and return the result
     * @param factor The scaling factors, can be negative
     * @returns The scaled vector
     */
    scale(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor)
    }

    /**
     * Subtract another vector from this vector
     * @param other The vector to subtract
     * @returns The current vector subtracted by the other vector
     */
    subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y)
    }

    /**
     * Whether this is the zero vector
     * @returns A boolean indicating if this is the zero vector
     */
    isZero(): boolean {
        return this.x == 0 && this.y == 0
    }

    /**
     * Negate the vector, same as scale(-1)
     * @returns The negated vector
     */
    negate(): Vector2 {
        return this.scale(-1)
    }

    /**
     * Normalize the vector to be length 1
     * @returns The normalized vector, or the zero vector if the vector was
     * already zero
     */
    normalize(): Vector2 {
        if (this.isZero())
            return this
        return this.scale(1 / this.length())
    }

    /**
     * Get the angle of this vector with the negative x-axis
     * @returns The angle as a value in [0, 2*pi)
     * @throws An error if one of the vectors is zero
     */
    angle(): number
    /**
     * Get the angle between this and another vector. Note that this is not
     * necessarily a value within a half circle. Will return the angle starting
     * from the current vector and ending at the other vector
     * @param other The other vector
     * @returns The angle between the two vectors as a value in [0, 2*pi)
     * @throws An error if one of the vectors is zero
     */
    angle(other: Vector2): number
    angle(other?: Vector2): number {
        if (this.isZero() || (other?.isZero() ?? false))
            throw new Error("Cannot determine angle of zero vector")
        if (other == undefined)
            return Math.atan2(this.y, this.x)
        const thisAngle = this.angle()
        const otherAngle = other.angle()
        const diff = otherAngle - thisAngle
        return diff < 0 ? diff + 2 * Math.PI : diff
    }

    /**
     * Find the distance to another vector
     * @param other The other vector
     * @returns The distance
     */
    distanceTo(other: Vector2): number {
        return this.subtract(other).length()
    }

    /**
     * Dot product between two vectors
     * @param other The other vector in the product
     * @return The value of the dot product
     */
    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y
    }

}