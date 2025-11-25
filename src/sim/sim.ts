
import { ref, toRef, type MaybeRefOrGetter, type Ref } from "vue"
import { useAnimationFrame } from "../util/animationFrame"
import { type GravityObject } from "./object"
import { objectsToState, slopeFunction, stateToObjects } from "./odeConvert"
import { RKFSolver } from "./rkf45"

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
    /** Error tolerance for the RKF solver (default 1000) */
    tolerance?: number,
}

/**
 * Type returned by the gravity sim composable
 */
export type GravitySim = {
    /** Ref to simulated objects, which can be modified */
    objects: Ref<GravityObject[]>,
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
            tolerance: optionsRef.value?.tolerance ?? 1000,
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

    useAnimationFrame(frame)

    return { objects }

}