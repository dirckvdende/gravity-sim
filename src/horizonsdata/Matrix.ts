
/** Matrix utility class */
export class Matrix {

    // Entries of the matrix
    entries: number[][]

    /**
     * Constructor
     * @param entries Entries of the matrix, which are (deep) copied
     */
    constructor(...entries: (Vector | number[])[]) {
        if (entries[0] == undefined || !(entries[0] instanceof Vector)) {
            this.entries = (entries as number[][]).map((row) => [...row])
            return
        }
        this.entries = (entries as Vector[]).map((vector) => {
            const values: number[] = []
            for (let i = 0; i < vector.n; i++)
                values.push(vector.entry(i))
            return values
        })
    }

    /** Number of rows in the matrix */
    get n(): number {
        return this.entries.length
    }

    /** Number of columns in the matrix */
    get m(): number {
        return this.entries[0]?.length ?? 0
    }

    columns(): Vector[] {
        return this.transpose().rows()
    }

    rows(): Vector[] {
        return this.entries.map((row) => new Vector(...row))
    }

    multiply(vector: Vector): Vector {
        if (vector.n != this.m)
            throw new Error("Cannot multiply matrix and vector with " +
            "incompatible shapes")
        return new Vector(...this.rows().map((row) => row.dot(vector)))
    }

    transpose(): Matrix {
        const entries: number[][] = []
        for (let j = 0; j < this.m; j++) {
            const row: number[] = []
            for (let i = 0; i < this.n; i++)
                row.push(this.entries[i]![j]!)
            entries.push(row)
        }
        return new Matrix(...entries)
    }

    inverse(): Matrix {
        const a = this.entries.map((row) => [...row])
        for (let i = 0; i < this.n; i++)
            for (let j = 0; j < this.m; j++)
                a[i]!.push(i == j ? 1 : 0)
        const b = new Matrix(...a).gauss()
        for (let i = 0; i < this.n; i++)
            b.entries[i]! = b.entries[i]!.splice(0, this.n)
        return b
    }

    gauss(): Matrix {
        const a = this.entries.map((row) => [...row])
        for (let i = 0; i < Math.min(this.n, this.m); i++) {
            let j = i
            for (; j < this.n; j++) {
                if (Math.abs(a[j]![i]!) > 1e-9) {
                    if (i != j) {
                        const t = a[i]!
                        a[i] = a[j]!
                        a[j] = t
                    }
                    break
                }
            }
            if (j == this.n)
                continue
            const d = a[i]![i]!
            for (let j = 0; j < this.m; j++)
                a[i]![j]! /= d
            for (let j = 0; j < this.n; j++) {
                if (i != j) {
                    const d = a[j]![i]!
                    for (let k = 0; k < this.m; k++)
                        a[j]![k]! -= d * a[i]![k]!
                }
            }
        }
        return new Matrix(...a)
    }
    
}

/** Arbitrarily-sized vector */
export class Vector {

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