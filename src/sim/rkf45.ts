
/**
 * Options that can be passed to the RKF45 solver
 */
export type RKFOptions = {
    /**
     * Tolerance for the solver to determine required step sizes. Lower
     * tolerance means step size will be smaller. (default 1)
     */
    tolerance: number,
}

// Factors while calculating k's
const B = [
    [1 / 4],
    [3 / 32, 9 / 32],
    [1932 / 2197, -7200 / 2197, 7296 / 2197],
    [439 / 216, -8, 3680 / 513, -845 / 4104],
    [-8 / 27, 2, -3544 / 2565, 1859 / 4104, -11 / 40],
]
// Factors in front of k's while calculating order 4 approximation
const C4 = [25 / 216, 1408 / 2565, 2197 / 4101, -1 / 5]
// Factors in front of k's while calculating order 5 approximation
const C5 = [16 / 135, 6656 / 12825, 28561 / 56430, -9 / 50, 2 / 55]

/**
 * Class for simulating ODEs using RKF45. Implementation is derived from
 * https://maths.cnam.fr/IMG/pdf/RungeKuttaFehlbergProof.pdf and
 * https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta%E2%80%93Fehlberg_method
 */
export class RKFSolver<T extends {
    scale(x: number): T,
    add(other: T): T,
    length(): number,
}> {

    // Current simulation state
    private state: T[]
    // Function to calculate the slope at a given state
    private readonly slope: (state: T[]) => T[]
    // Options passed to the solver
    private readonly options: RKFOptions

    /**
     * Constructor
     * @param initialState Array of initial state of the system
     * @param slope Function to calculate the slope at a given state
     * @param options Solver options
     */
    constructor(initialState: T[], slope: (state: T[]) => T[], options?:
    Partial<RKFOptions>) {
        this.state = initialState
        this.slope = slope
        this.options = RKFSolver.defaultOptions(options ?? {})
    }

    /**
     * Evolve the sim by a given amount of time
     * @param time The amount of time to evolve the sim by. Depending on error
     * tolerance this may mean multiple steps are executed
     * @param maxSteps Maximum number of steps to execute. If this is exceeded
     * the solver stops earlier, simulating a shorter amount of time
     * @returns The evolved state and the amount of time it was evolved by
     */
    evolve(time: number, maxSteps: number = Infinity): {
        state: T[],
        time: number,
    } {
        const initialTime = time
        while (time > 0 && maxSteps > 0) {
            let errorTooHigh = true
            let h = time
            while (errorTooHigh) {
                const k = [this.scale(this.slope(this.state), h)]
                for (let i = 0; i < 5; i++)
                    k.push(this.nextK(k, B[i]!, h))
                const order4 = this.add(this.state, this.linearComb(C4, k))
                const order5 = this.add(this.state, this.linearComb(C5, k))
                const error = this.length(this.add(order4, this.scale(order5,
                -1)))
                errorTooHigh = error > this.options.tolerance
                if (errorTooHigh)
                    h = 0.9 * h * Math.pow(this.options.tolerance / error,
                    1 / 5)
                else
                    this.state = order4
            }
            time -= h
            maxSteps--
        }
        return {
            state: this.state,
            time: initialTime - time,
        }
    }

    /**
     * Calculate k_i from k_1, ..., k_i-1
     * @param prevK Previous vectors k
     * @param factors Factors to multiply each previous k with
     * @param h Step size
     * @returns The new vector k
     */
    private nextK(prevK: T[][], factors: number[], h: number): T[] {
        return this.scale(this.slope(prevK.reduce((prev, cur, index) =>
            this.add(prev, this.scale(cur, factors[index] ?? 0)), this.state
        )), h)
    }

    /**
     * Determine linear combination of vectors
     * @param factors Factors in front of the vectors
     * @param vectors Vectors to add together
     * @returns The weighted sum/linear combination of the vectors with the
     * factors. If the factors array in shorter the remaining vectors are
     * multiplied scaled by 0
     */
    private linearComb(factors: number[], vectors: T[][]): T[] {
        return vectors.map((vector, index) =>
            this.scale(vector, factors[index] ?? 0)
        ).reduce(this.add)
    }

    /**
     * Scale a vector of values
     * @param vector The vector to scale
     * @param factor The factor to scale the vector by
     * @returns The scaled vector
     */
    private scale(vector: T[], factor: number): T[] {
        return vector.map((entry) => entry.scale(factor))
    }

    /**
     * Add two vectors of values together (element-wise)
     * @param vectorA First vector to add
     * @param vectorB Second vector to add
     * @returns The sum of the two vectors
     */
    private add(vectorA: T[], vectorB: T[]): T[] {
        return vectorA.map((entry, index) => {
            if (vectorB[index] == undefined)
                throw new Error("Cannot add vectors of unequal size")
            return entry.add(vectorB[index])
        })
    }

    /**
     * Get the length of a vector of values, using the length() value returned
     * by each value
     * @param vector The vector to get the length of
     * @returns The length
     */
    private length(vector: T[]): number {
        return Math.sqrt(vector.reduce((prev, cur) =>
            prev + cur.length() * cur.length(), 0))
    }

    /**
     * Add default values to partial RKF options
     * @param options The partially filled in options
     * @returns The options with missing fields replaced by default values
     */
    private static defaultOptions(options: Partial<RKFOptions>): RKFOptions {
        return {
            tolerance: 1,
            ...options,
        }
    }

}