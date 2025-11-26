
import { computed, ref, toRef, type ComputedRef, type MaybeRefOrGetter, type Ref } from
"vue"
import { useAnimationFrame } from "../util/animationFrame"
import { type GravityObject } from "./object"
import { objectsToState, slopeFunction, stateToObjects } from "./odeConvert"
import { RKFSolver } from "./rkf45"
import Vector2 from "@/util/Vector2"

/**
 * Options passed to the gravity sim composable
 */
export type GravitySimOptions = {
    /**
     * Maximum time units (seconds) of every simulation step (default
     * Infinity)
     */
    maxStepSize?: number,
    /**
     * Maximum time between frames used for scaling. This is used mainly when
     * the used tabs out and back in, and the time between frames is very large
     * (default .1, i.e. 10 fps)
     */
    maxTimeBetweenFrames?: number,
    /**
     * Simulation speed factor. A value of 3 means 3 simulation time units pass
     * every second (default 1)
     */
    speed?: number,
    /** Maximum number of steps to execute per frame (default 100) */
    maxStepsPerFrame?: number,
    /**
     * Error tolerance for the RKF solver, relative to the maximum distance
     * between any two objects (default 1e-6)
     */
    tolerance?: number,
}

/**
 * Type returned by the gravity sim composable
 */
export type GravitySim = {
    /** Ref to simulated objects, which can be modified */
    objects: Ref<GravityObject[]>,
    /** Computed ref of the center of mass */
    barycenter: ComputedRef<Vector2>,
}

/**
 * Gravity simulator composable
 * @param options Simulation options
 * @returns Gravity sim with objects that can be modified
 */
export function useGravitySim(options?: MaybeRefOrGetter<GravitySimOptions>):
GravitySim {

    // Tracked objects with gravitational effect
    const objects = ref<GravityObject[]>([])
    // Reference to input argument
    const optionsRef = toRef(options)

    // Time of last step, so sim speed will be constant
    let lastStep = performance.now()

    /**
     * Function that is called every frame to update the object positions and
     * velocities
     */
    function frame(): void {
        const state = objectsToState(objects.value)
        const slope = slopeFunction(objects.value)
        const solver = new RKFSolver(state, slope, {
            tolerance: (optionsRef.value?.tolerance ?? 1e-6) * maxDistance(),
        })
        const speed = optionsRef.value?.speed ?? 1
        const time = Math.min(
            optionsRef.value?.maxStepSize ?? Infinity,
            Math.min(
                (performance.now() - lastStep) / 1000,
                optionsRef.value?.maxTimeBetweenFrames ?? .1
            ) * speed
        )
        lastStep = performance.now()
        const { state: newState } = solver.evolve(time,
        optionsRef.value?.maxStepsPerFrame ?? 10)
        const newObjects = objects.value.slice()
        stateToObjects(newState, newObjects)
        objects.value = newObjects
    }

    // Call frame() function every animation frame
    useAnimationFrame(frame)

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

    const barycenter = computed(() => {
        let total = Vector2.Zero
        let mass = 0
        for (const object of objects.value) {
            total = total.add(object.position.scale(object.mass))
            mass += object.mass
        }
        return total.scale(1 / mass)
    })

    return { objects, barycenter }

}