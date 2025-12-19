
import Vector from "./Vector"

/** Matrix utility class */
export default class Matrix {

    // Entries of the matrix
    private entries: number[][]

    /**
     * Constructor
     * @param entries Entries of the matrix, which are (deep) copied
     */
    constructor(...entries: (Vector | number[])[]) {
        if (entries[0] == undefined || !(entries[0] instanceof Vector)) {
            this.entries = (entries as number[][]).map((row) => [...row])
            return
        }
        this.entries = (entries as Vector[]).map((vector) => [...vector])
    }

    /**
     * Iterator over the matrix rows
     * @returns A generator over the matrix rows, returned as vectors
     */
    [Symbol.iterator](): Generator<Vector> {
        return this.rows()
    }

    /** Number of rows and columns in the matrix */
    get shape(): [number, number] {
        return [this.entries.length, this.entries[0]?.length ?? 0]
    }

    /**
     * Get the row at the given index as a vector
     * @param index The index of the row
     * @returns The row
     * @throws An error if the index is out of range
     */
    row(index: number): Vector {
        const row = this.entries[index]
        if (row == undefined)
            throw new Error(`Row index ${index} out of range`)
        return new Vector(...row)
    }

    /**
     * Get the column at the given index as a vector
     * @param index The index of the column
     * @returns The column
     * @throws An error if the index is out of range
     */
    column(index: number): Vector {
        if (index < 0 || index >= this.shape[1])
            throw new Error(`Column index ${index} out of range`)
        const column: number[] = []
        for (const row of this.entries)
            column.push(row[index] ?? 0)
        return new Vector(...column)
    }

    /**
     * Iterate over the rows of the matrix
     * @returns A generator over the rows as vectors
     */
    *rows(): Generator<Vector> {
        for (let i = 0; i < this.shape[0]; i++)
            yield this.row(i)
    }

    /**
     * Iterate over the columns of the matrix
     * @returns A generator over the columns as vectors
     */
    *columns(): Generator<Vector> {
        for (let i = 0; i < this.shape[1]; i++)
            yield this.column(i)
    }

    /**
     * Multiply this matrix with another matrix on the right
     * @param matrix The other matrix to multiply (on the right)
     * @returns The result of the multiplication. If this matrix has shape
     * [m, k] and the other [k, n], the resulting matrix will have shape [m, n]
     * @throws An error if the shapes of this matrix and other are not [m, k]
     * and [k, n] respectively
     */
    multiply(matrix: Matrix): Matrix
    /**
     * Multiply this matrix with a vector on the right
     * @param vector The vector to multiply, which has as many entries as this
     * matrix has columns
     * @returns The result of the multiplication, which is another vector of the
     * same size as the original
     * @throws An error if the shape of the vector is not equal to the number of
     * columns in the matrix
     */
    multiply(vector: Vector): Vector
    multiply(vectorOrMatrix: Vector | Matrix): Vector | Matrix {
        if (vectorOrMatrix instanceof Vector) {
            const vector = vectorOrMatrix
            if (vector.shape != this.shape[1])
                throw new Error(`Cannot multiply matrix with shape ` +
                `${this.shape} and vector with shape ${vector.shape}`)
            return new Vector(...Array.from(this.rows()).map((row) =>
                row.dot(vector)))
        }
        const matrix = vectorOrMatrix
        if (matrix.shape[0] != this.shape[1])
            throw new Error(`Cannot multiply matrices with shapes ` +
            `${this.shape} and ${matrix.shape}`)
        return new Matrix(...Array.from(matrix.columns()).map((vector) =>
            Array.from(this.rows()).map((row) => row.dot(vector))))
    }

    /**
     * Transpose this matrix and return the result
     * @returns The transposed matrix
     */
    transpose(): Matrix {
        return new Matrix(...this.columns())
    }

    /**
     * Invert this matrix and return the result
     * @returns The inverted matrix
     * @throws An error if the matrix is not square, but doesn't check if it's
     * invertable
     */
    inverse(): Matrix {
        if (this.shape[0] != this.shape[1])
            throw new Error("Cannot determine inverse of non-square matrix")
        const a = this.entries.map((row) => [...row])
        for (let i = 0; i < this.shape[0]; i++)
            for (let j = 0; j < this.shape[1]; j++)
                a[i]!.push(i == j ? 1 : 0)
        const b = new Matrix(...a).gauss()
        for (let i = 0; i < this.shape[0]; i++)
            b.entries[i]! = b.entries[i]!.splice(0, this.shape[1])
        return b
    }

    /**
     * Perform gaussian elimination on the current matrix and determine row
     * echelon form. This does not modify the original matrix
     * @returns The matrix in row echelon form
     */
    gauss(): Matrix {
        const a = this.entries.map((row) => [...row])
        for (let i = 0; i < Math.min(...this.shape); i++) {
            let j = i
            for (; j < this.shape[0]; j++) {
                if (Math.abs(a[j]![i]!) > 1e-9) {
                    if (i != j) {
                        const t = a[i]!
                        a[i] = a[j]!
                        a[j] = t
                    }
                    break
                }
            }
            if (j == this.shape[0])
                continue
            const d = a[i]![i]!
            for (let j = 0; j < this.shape[1]; j++)
                a[i]![j]! /= d
            for (let j = 0; j < this.shape[0]; j++) {
                if (i != j) {
                    const d = a[j]![i]!
                    for (let k = 0; k < this.shape[1]; k++)
                        a[j]![k]! -= d * a[i]![k]!
                }
            }
        }
        return new Matrix(...a)
    }

    /**
     * Create a matrix filled with zeros
     * @param shape The shape of the matrix
     * @returns The created zero matrix
     */
    static zero(...shape: [number, number]): Matrix {
        const rows: number[][] = []
        for (let i = 0; i < shape[0]; i++) {
            const row: number[] = []
            for (let j = 0; j < shape[1]; j++)
                row.push(0)
            rows.push(row)
        }
        return new Matrix(...rows)
    }
    
}
