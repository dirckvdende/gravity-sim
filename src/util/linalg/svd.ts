
import Matrix from "./Matrix"
import Vector from "./Vector"

const EPS = 2.2204460492503131e-16

/**
 * Determine the singular value decomposition of a matrix. The implementation is
 * a translation of the C implementation at
 * https://github.com/ampl/gsl/blob/master/linalg/svd.c#L761-L943
 * See also https://en.wikipedia.org/wiki/Singular_value_decomposition
 * @param matrix The matrix to decompose
 * @returns Matrices U, V and a vector S such that A = U*D*V^T, with D the
 * matrix with the entries of S on the diagonal. If a has shape [m, n], U has
 * shape [m, m], S has length min(m, n), and V has shape [n, n]
 */
export function svd(matrix: Matrix): {
    u: Matrix
    v: Matrix
    s: Vector
} {
    const [M, N] = matrix.shape
    // This part differs from the original implementation, but may be useful
    if (M < N) {
        // Note that if A = U*D*V^T, then A^T = V*D*U^T
        const { u, v, s } = svd(matrix.transpose())
        return { u: v, v: u, s }
    }
    // Extra error check since in out implementation we can have zero-shape
    // matrices
    if (N < 1)
        throw new Error("Cannot determine SVD of matrix with zero-shape")

    const A = matrix.copy()
    const Q = Matrix.identity(N)
    const S = Vector.zero(N)

    let count = 1
    let sweep = 0
    const sweepMax = Math.max(5 * N, 12)
    const tolerance = 10 * M * EPS

    // Store the column error estimates in S, for use during the
    // orthogonalization
    for (let j = 0; j < N; j++) {
        const cj = A.column(j)
        const sj = cj.length
        S.set(j, EPS * sj)
    }

    // Orthogonalize A by plane rotations
    while (count > 0 && sweep < sweepMax) {
        count = N * (N - 1) / 2
        for (let j = 0; j < N - 1; j++) {
            for (let k = j + 1; k < N; k++) {
                const cj = A.column(j)
                const ck = A.column(k)
                const p = cj.dot(ck) * 2
                const a = cj.length
                const b = ck.length
                const q = a * a  - b * b
                const v = Math.sqrt(p * p + q * q)
                const abserrA = S.get(j)
                const abserrB = S.get(k)
                const sorted = a >= b
                const orthog = Math.abs(p) <= tolerance * a * b
                const noisya = a < abserrA
                const noisyb = b < abserrB

                if (sorted && (orthog || noisya || noisyb)) {
                    count--
                    continue
                }

                // Calculate rotation angles
                let cosine = 0, sine = 0
                if (v == 0 || !sorted) {
                    cosine = 0
                    sine = 1
                } else {
                    cosine = Math.sqrt((v + q) / (2.0 * v));
                    sine = p / (2.0 * v * cosine);
                }

                // Apply rotation to A
                for (let i = 0; i < M; i++) {
                    const Aik = A.get(i, k)
                    const Aij = A.get(i, j)
                    A.set(i, j, Aij * cosine + Aik * sine)
                    A.set(i, k, -Aij * sine + Aik * cosine)
                }

                S.set(j, Math.abs(cosine) * abserrA + Math.abs(sine) * abserrB)
                S.set(k, Math.abs(sine) * abserrA + Math.abs(cosine) * abserrB)

                // Apply rotation to Q
                for (let i = 0; i < N; i++) {
                    const Qij = Q.get(i, j)
                    const Qik = Q.get(i, k)
                    Q.set(i, j, Qij * cosine + Qik * sine)
                    Q.set(i, k, -Qik * sine + Qik * cosine)
                }
            }
        }

        // Sweep completed
        sweep++

        // Orthogonalization complete. Compute singular values
        let prevNorm = -1
        for (let j = 0; j < N; j++) {
            const column = A.column(j)
            const norm = column.length
            if (norm == 0 || prevNorm == 0 ||
            (j > 0 && norm < tolerance * prevNorm)) {
                // Singular
                S.set(j, 0)
                // Annihilate column
                for (let i = 0; i < A.shape[0]; i++)
                    A.set(i, j, 0)
                prevNorm = 0
            } else {
                // Non-singular
                S.set(j, norm)
                // Normalize column
                for (let i = 0; i < A.shape[0]; i++)
                    A.set(i, j, A.get(i, j) / norm)
                prevNorm = norm
            }
        }
    }

    // Reached sweep limit
    if (count > 0)
        throw new Error("Jacobi iterations did not reach desired tolerance")

    return { u: A, v: Q, s: S }
}