
import { ref, toValue, type MaybeRefOrGetter, type Ref } from "vue";
import { useGravitySim, type GravitySimOptions, type GravitySimReturn } from
"@/composables/useGravitySim";
import { useAnimationFrame } from "@/composables/useAnimationFrame";
import type { GravityObject } from "@/util/sim/object";

// Difference between target time and elapsed time where sim is marked as
// "slowed"
const SLOWED_TRIGGER_DIFF = 1e-3

/** Options to pass to the gravity sim */
export type TimedGravitySimOptions = GravitySimOptions & {
    /** Whether the sim is paused (default false) */
    paused?: MaybeRefOrGetter<boolean>
    /**
     * Ratio between sim speed and real time, value of 3 means 3 seconds are
     * evolved in the sim every real-time second (default 1)
     */
    speed?: MaybeRefOrGetter<number>
    /**
     * Maximum time between frames used for scaling. This is used mainly
     * when the user tabs out and back in, and the time between frames is
     * very large (default .1, i.e. 10 fps)
     */
    maxTimeBetweenFrames?: MaybeRefOrGetter<number>,
}

/** Return value of the gravity sim composable */
export type TimedGravitySimReturn = GravitySimReturn & {
    /** Whether the sim is running more slowly than set in the options */
    slowed: Readonly<Ref<boolean>>
}

/**
 * Continuously running gravity sim, which calls evolve() every frame
 * @param objects Ref to array of objects to evolve. Objects are modified
 * in-place to keep reactivity
 * @param options Options for the timed gravity sim, extended version of the
 * options passed to the base gravity sim
 * @returns Same as base gravity sim, plus a ref which indicates if the sim is
 * running slower than targeted
 */
export function useTimedGravitySim(objects: Ref<GravityObject[]>,
options?: TimedGravitySimOptions): TimedGravitySimReturn {

    // Non-timed gravity sim
    const sim = useGravitySim(objects, options)
    // Whether sim is running more slowly than set in the options
    const slowed = ref(false)
    // Timestamp of last step, so sim speed will be constant
    let lastStep = performance.now()

    // Options with filled-in defaults
    const fullOptions = {
        paused: false,
        speed: 1,
        maxTimeBetweenFrames: .1,
        ...options,
    }

    /** Function that is called every frame to evolve the sim */
    function frame(): void {
        if (toValue(fullOptions.paused) || toValue(fullOptions.speed) == 0) {
            lastStep = performance.now()
            return
        }
        const targetTime = Math.min(
            (performance.now() - lastStep) / 1000,
            toValue(fullOptions.maxTimeBetweenFrames),
        ) * toValue(fullOptions.speed)
        const elapsedTime = sim.evolve(targetTime)
        slowed.value = Math.abs(targetTime - elapsedTime) > SLOWED_TRIGGER_DIFF
        lastStep = performance.now()
    }

    useAnimationFrame(frame)

    return { ...sim, slowed }
}