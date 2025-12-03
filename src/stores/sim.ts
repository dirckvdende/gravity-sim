
import type { GravityObject } from "@/oldsim/object";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Vector2 from "@/util/Vector2";
import { objectsToState, stateToObjects, slopeFunction } from
"@/oldsim/odeConvert";
import { RKFSolver } from "@/oldsim/rkf45";
import { useAnimationFrame } from "@/util/animationFrame";
import { serializer } from "./serializer";

/** Simulation options */
export const useSimOptionsStore = defineStore("gravity-sim-options", () => {
    return {
        /**
         * Maximum time units (seconds) of every simulation step (default
         * Infinity)
         */
        maxStepSize: ref(Infinity),
        /**
         * Maximum time between frames used for scaling. This is used mainly
         * when the user tabs out and back in, and the time between frames is
         * very large (default .1, i.e. 10 fps)
         */
        maxTimeBetweenFrames: ref(.1),
        /**
         * Simulation speed factor. A value of 3 means 3 simulation time units
         * pass every second (default 1)
         */
        speed: ref(1),
        /** Wether the simulator is currently paused (default false) */
        paused: ref(false),
        /** Maximum number of steps to execute per frame (default 100) */
        maxStepsPerFrame: ref(100),
        /**
         * Error tolerance for the RKF solver, relative to the maximum distance
         * between any two objects (default 1e-8)
         */
        tolerance: ref(1e-8),
    }
}, {
    persist: {
        serializer,
        pick: ["speed", "paused"],
    },
    saveToFiles: {
        files: ["state"],
        serializer,
        pick: ["speed", "paused"],
    }
})

/**
 * Main simulator with data on all objects (current positions, velocities, etc.)
 */
export const useSimStore = defineStore("gravity-sim", () => {
    // Tracked objects with gravitational effect
    const objects = ref<GravityObject[]>([])
    // Simulator options
    const options = useSimOptionsStore()
    // Whether the simulation is running more slowly than set in the options
    const slowed = ref(false)
    // Current timestamp for display to the user, does not impact simulation.
    // Timestamp is updated in accordance with simulation steps
    const timestamp = ref(new Date())
    // Time of last step, so sim speed will be constant
    let lastStep = performance.now()

    /**
     * Function that is called every frame to update the object positions and
     * velocities
     */
    function frame(): void {
        if (options.paused || options.speed == 0) {
            lastStep = performance.now()
            return
        }
        const backward = options.speed < 0
        const speed = Math.abs(options.speed)
        const state = objectsToState(objects.value)
        const slope = slopeFunction(objects.value, backward)
        const solver = new RKFSolver(state, slope, {
            tolerance: options.tolerance * maxDistance(),
        })
        const time = Math.min(
            options.maxStepSize,
            Math.min(
                (performance.now() - lastStep) / 1000,
                options.maxTimeBetweenFrames
            ) * speed
        )
        lastStep = performance.now()
        const { state: newState, time: elapsedTime } = solver.evolve(time,
            options.maxStepsPerFrame)
        slowed.value = time - elapsedTime > 1e-3
        timestamp.value = new Date(Math.round(timestamp.value.getTime() +
            elapsedTime * 1000 * (backward ? -1 : 1)))
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

    return { objects, barycenter, resetToBarycenter, slowed, timestamp }
}, {
    saveToFiles: {
        files: ["state"],
        serializer,
        pick: ["timestamp", "objects"],
    }
})