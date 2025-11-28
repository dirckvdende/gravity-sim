
import type { GravityObject } from "@/sim/object";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Vector2 from "@/util/Vector2";
import { objectsToState, stateToObjects, slopeFunction } from
"@/sim/odeConvert";
import { RKFSolver } from "@/sim/rkf45";
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
         * between any two objects (default 1e-6)
         */
        tolerance: ref(1e-6),
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
    // Time of last step, so sim speed will be constant
    let lastStep = performance.now()

    /**
     * Function that is called every frame to update the object positions and
     * velocities
     */
    function frame(): void {
        if (options.paused) {
            lastStep = performance.now()
            return
        }
        const state = objectsToState(objects.value)
        const slope = slopeFunction(objects.value)
        const solver = new RKFSolver(state, slope, {
            tolerance: (options.tolerance ?? 1e-6) * maxDistance(),
        })
        const speed = options.speed ?? 1
        const time = Math.min(
            options.maxStepSize ?? Infinity,
            Math.min(
                (performance.now() - lastStep) / 1000,
                options.maxTimeBetweenFrames ?? .1
            ) * speed
        )
        lastStep = performance.now()
        const { state: newState } = solver.evolve(time,
        options.maxStepsPerFrame ?? 10)
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

    return { objects, barycenter, resetToBarycenter }
}, {
    saveToFiles: {
        files: ["state"],
        serializer,
    }
})