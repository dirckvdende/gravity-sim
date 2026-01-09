
import { computed, ref, toValue, type ComputedRef, type MaybeRefOrGetter,
type Ref } from "vue";
import type { GravityObject } from "@/util/sim/object";
import { objectsToState, slopeFunction, stateToObjects } from
"@/util/sim/odeConvert";
import { RKFSolver } from "@/util/sim/rkf45";
import Vector2 from "@/util/linalg/Vector2";

/** Options to pass to the gravity sim */
export type GravitySimOptions = {
    /**
     * Maximum time units (seconds) of every evolve() call (default Infinity)
     */
    maxEvolveTime?: MaybeRefOrGetter<number>,
    /**
     * Maximum number of steps (in RKF sim) to execute per evolve() call
     * (default 100)
     */
    maxStepsPerEvolve?: MaybeRefOrGetter<number>,
    /**
     * Threshold time in seconds after which evolve() call should stop
     * performing steps. Steps are stopped as soon as maxStepsPerEvolve or
     * maxEvolveComputeTime is exceeded (default 1/120)
     */
    maxComputeTime?: MaybeRefOrGetter<number>,
    /**
     * Error tolerance for the RKF solver, relative to the maximum distance
     * between any two objects (default 1e-8)
     */
    tolerance?: MaybeRefOrGetter<number>,
}

/** Return value of the gravity sim composable */
export type GravitySimReturn = {
    /**
     * Evolve the gravity sim by a given amount of time. Returns the actual
     * evolved time, which may be lower due to performance constraints set in
     * the settings
     * @param time The amount of time to (try to) evolve by. Can be negative to
     * evolve backward
     * @returns The amount of time actually evolved
     */
    evolve(time: number): number
    /**
     * Current timestamp of the sim. Can be modified, but this doesn't evolve
     * the sim
     */
    timestamp: Ref<Date>
    /** Barycenter (center of mass) of the objects in the sim */
    barycenter: ComputedRef<Vector2>
    /**
     * Normalize positions and velocities such that barycenter is at (0, 0) and
     * doesn't move
     */
    resetToBarycenter(): void
}

/**
 * Gravity sim with initially zero objects. An evolve function can be called to
 * simulate gravity
 * @param objects Ref to objects array that should be evolved by the gravity
 * sim. Objects are modified in-place to keep reactivity
 * @param options Options for the gravity sim, such as max step size, error
 * tolerance
 * @returns Gravity sim objects, evolve function, and current timestamp
 */
export function useGravitySim(objects: Ref<GravityObject[]>,
options?: GravitySimOptions): GravitySimReturn {
    const fullOptions = fillOptionsDefaults(options)
    const timestamp = ref(new Date())

    /**
     * Evolve the gravity sim by a given amount of time. Returns the actual
     * evolved time, which may be lower due to performance constraints set in
     * the settings
     * @param time The amount of time to (try to) evolve by. Can be negative to
     * evolve backward
     * @returns The amount of time actually evolved
     */
    function evolve(time: number): number {
        const backward = time < 0
        time = Math.min(toValue(fullOptions.maxEvolveTime), Math.abs(time))
        const state = objectsToState(objects.value)
        const slope = slopeFunction(objects.value, backward)
        const solver = new RKFSolver(state, slope, {
            tolerance: toValue(fullOptions.tolerance) * maxDistance()
        })
        const { state: newState, time: elapsedTime } = solver.evolve(time,
            toValue(fullOptions.maxStepsPerEvolve), toValue(
            fullOptions.maxComputeTime))
        timestamp.value = new Date(Math.round(timestamp.value.getTime() +
            elapsedTime * 1000 * (backward ? -1 : 1)))
        stateToObjects(newState, objects.value)
        return elapsedTime * (backward ? -1 : 1)
    }

    /**
     * Maximum distance between any two objects
     * @returns Maximum distance
     */
    function maxDistance(): number {
        let mx = 0
        for (const first of objects.value)
            for (const second of objects.value)
                mx = Math.max(mx, first.position.distanceTo(second.position))
        return mx
    }

    // Center of mass of the system
    const barycenter = computed(() => {
        let total = Vector2.Zero
        let mass = 0
        for (const object of objects.value) {
            total = total.add(object.position.scale(object.mass))
            mass += object.mass
        }
        if (mass == 0)
            return Vector2.Zero
        return total.scale(1 / mass)
    })

    /**
     * Velocity of the barycenter (i.e. total shift of the system over time)
     */
    function barycenterVelocity(): Vector2 {
        let total = Vector2.Zero
        let mass = 0
        for (const object of objects.value) {
            total = total.add(object.velocity.scale(object.mass))
            mass += object.mass
        }
        return mass == 0 ? Vector2.Zero : total.scale(1 / mass)
    }

    /**
     * Normalize positions and velocities such that barycenter is at (0, 0) and
     * doesn't move
     */
    function resetToBarycenter(): void {
        const position = barycenter.value
        const velocity = barycenterVelocity()
        for (const object of objects.value) {
            object.position = object.position.subtract(position)
            object.velocity = object.velocity.subtract(velocity)
        }
    }

    return { evolve, timestamp, barycenter, resetToBarycenter }
}

/**
 * Fill in default values for undefined options
 * @param options The options passed to the gravity sim
 * @returns The options with added default values
 */
function fillOptionsDefaults(options?: GravitySimOptions):
Required<GravitySimOptions> {
    return {
        maxEvolveTime: Infinity,
        maxStepsPerEvolve: 1000,
        maxComputeTime: 1 / 120,
        tolerance: 1e-8,
        ...options,
    }
}