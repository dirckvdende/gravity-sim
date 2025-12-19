
/**
 * Arbitrarily-sized vector. Unlike Vector2 and Vector3, these vectors can be
 * modified by using set() or get()
 */
export default class Vector {

    // Entries of the vector
    private entries: number[]

    /**
     * Constructor
     * @param entries The entries of the vector
     */
    constructor(...entries: number[]) {
        this.entries = [...entries]
    }

    /**
     * Iterator of the vector entries
     * @returns A generator over all the entries in vector
     */
    *[Symbol.iterator](): Generator<number> {
        for (const entry of this.entries)
            yield entry
    }

    /** Number of entries in the vector */
    get shape(): number {
        return this.entries.length
    }

    /** Length/norm of the vector */
    get length(): number {
        return Math.sqrt(this.length2)
    }

    /** Squared length/norm of the vector */
    get length2(): number {
        return this.entries.reduce((prev, cur) => prev + cur * cur, 0)
    }

    /**
     * Get a value in the vector at a given index
     * @param index The index of the entry to get
     * @returns The value at the index
     * @throws An error if the index is out of range
     */
    get(index: number): number {
        const value = this.entries[index]
        if (value == undefined)
            throw new Error(`Invalid vector index ${index} in vector with ` +
            `shape ${this.entries.length}`)
        return value
    }

    /**
     * Set a value in the vector at a given index
     * @param index The index to modify
     * @param value The value to set at this index
     * @returns The newly set value
     * @throws An error if the index is out of range
     */
    set(index: number, value: number): number {
        if (this.entries[index] == undefined)
            throw new Error(`Invalid vector index ${index} in vector with ` +
            `shape ${this.entries.length}`)
        return this.entries[index] = value
    }

    /**
     * Check if this vector is the zero vector (i.e. it contains only zeros)
     * @returns Whether this is the zero vector
     */
    isZero(): boolean {
        for (const entry of this.entries)
            if (entry != 0)
                return false
        return true
    }

    /**
     * Orthonally project a vector onto the line spanned by another vector
     * @param target Target vector to project onto
     * @returns The projected vector, or the zero vector if the target vector is
     * zero
     */
    project(target: Vector): Vector {
        if (this.shape != target.shape)
            throw new Error("Cannot project onto vector of different shape")
        if (target.isZero())
            return Vector.zero(this.shape)
        return target.scale(this.dot(target) / target.dot(target))
    }

    /**
     * Scale a vector with a given amount
     * @param factor The factor to scale the vector by
     * @returns The scaled vector
     */
    scale(factor: number): Vector {
        return new Vector(...this.entries.map((v) => v * factor))
    }

    /**
     * Calculate the dot product between two vectors
     * @param other The other vector in the dot product. Must have the same
     * shape as this vector
     * @returns The dot product of the two numbers
     * @throws An error if the two vectors have different shapes
     */
    dot(other: Vector): number {
        if (this.shape != other.shape)
            throw new Error("Cannot determine dot product of differently " +
            "vectors with different shapes")
        return this.entries.reduce((prev, cur, index) =>
            prev + cur * other.get(index), 0)
    }

    /**
     * Normalize the vector. The original vector is not modified
     * @returns The normalized vector, with norm 1, or the zero vector if this
     * is the zero vector
     */
    normalize(): Vector {
        if (this.isZero())
            return this
        return this.scale(1 / this.length)
    }

    /**
     * Add this vector and another vector
     * @param other The other vector to add to this one
     * @returns The resulting vector
     * @throws An error if the vectors have different shapes
     */
    add(other: Vector): Vector {
        if (this.shape != other.shape)
            throw new Error("Cannot add vectors of different size")
        return new Vector(...this.entries.map((value, index) =>
            value + other.get(index)))
    }

    /**
     * Subtract another vector from this vector
     * @param other The vector to subtract from this vector
     * @returns The resulting vector
     * @throws An error if the vectors have different shapes
     */
    subtract(other: Vector): Vector {
        return this.add(other.scale(-1))
    }

    /**
     * Create a zero vector
     * @param shape The shape of the zero vector to create
     * @returns The zero vector
     */
    static zero(shape: number): Vector {
        const result: number[] = []
        for (let i = 0; i < shape; i++)
            result.push(0)
        return new Vector(...result)
    }

    /**
     * Determine an orthonormal basis for the space spanned by a list of vectors
     * @param vectors The vectors that span the target space. The resulting
     * orthonormal basis is constructed by repeatedly subtracting projections
     * onto vectors already present in the basis from the input vectors
     * (Gram-Schmidt). This, for example, means the first output vector will
     * always be equal to the first input vector normalized
     * @returns The orthonormal basis
     */
    static orthonormalBasis(...vectors: Vector[]): Vector[] {
        const out: Vector[] = []
        for (const v of vectors) {
            let cur = v
            for (const u of out)
                cur = cur.subtract(v.project(u))
            if (cur.length < 1e-9)
                out.push(cur)
        }
        return out.map((u) => u.normalize())
    }

}