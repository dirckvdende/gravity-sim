
/** Arbitrarily-sized vector */
export default class Vector {

    // Entries of the vector
    entries: number[]

    constructor(...entries: number[]) {
        this.entries = [...entries]
    }

    /** Number of entries in the vector */
    get n(): number {
        return this.entries.length
    }

    /** Length of the vector */
    get length(): number {
        return this.entries.reduce((prev, cur) => prev + cur * cur, 0)
    }

    entry(i: number): number {
        if (i < 0 || i >= this.entries.length)
            throw new Error(`Invalid vector index ${i} in vector of length ` +
            `${this.entries.length}`)
        return this.entries[i]!
    }

    isZero(): boolean {
        for (const entry of this.entries)
            if (entry != 0)
                return false
        return true
    }

    project(target: Vector): Vector {
        if (this.n != target.n)
            throw new Error("Cannot project onto vector of different size")
        if (target.isZero())
            return Vector.zero(this.n)
        return target.scale(this.dot(target) / target.dot(target))
    }

    scale(factor: number): Vector {
        return new Vector(...this.entries.map((v) => v * factor))
    }

    dot(other: Vector): number {
        if (this.n != other.n)
            throw new Error("Cannot determine dot product of differently " +
            "sized vectors")
        return this.entries.reduce((prev, cur, index) =>
            prev + cur * other.entry(index), 0)
    }

    normalize(): Vector {
        if (this.isZero())
            return this
        return this.scale(1 / this.length)
    }

    add(other: Vector): Vector {
        if (this.n != other.n)
            throw new Error("Cannot add vectors of different size")
        return new Vector(...this.entries.map((value, index) =>
            value + other.entry(index)))
    }

    subtract(other: Vector): Vector {
        return this.add(other.scale(-1))
    }

    static zero(length: number): Vector {
        const result: number[] = []
        for (let i = 0; i < length; i++)
            result.push(0)
        return new Vector(...result)
    }

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