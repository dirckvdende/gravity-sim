
import Vector2 from "@/util/Vector2"
import { ref, toRef, type MaybeRefOrGetter, type Ref } from "vue"
import { useAnimationFrame } from "../util/animationFrame"
import { type GravityObject } from "./object"
import { GRAV_CONSTANT, DISTANCE_SMOOTHING } from "./constants"

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

    /**
     * Calculate the gravitational force on an object by all other objects
     * @param object The object to calculate the force on
     * @returns The force vector in Newtons
     */
    function forceOnObject(object: GravityObject): Vector2 {
        let total = Vector2.Zero
        for (const other of objects.value) {
            if (other == object)
                continue
            total = total.add(objectForce(object, other))
        }
        return total
    }

    // Time of last step, so sim speed will be constant
    let lastStep = performance.now()

    /**
     * Execute a single step in the simulation
     */
    function step(): void {
        const elapsed = Math.min((performance.now() - lastStep) / 1000,
        optionsRef.value?.maxTimeBetweenFrames ?? .1)
        lastStep = performance.now()
        const maxStepSize = optionsRef.value?.maxStepSize ?? Infinity
        const scaledElapsed = (optionsRef.value?.speed ?? 1) * elapsed
        const stepSize = Math.min(maxStepSize, scaledElapsed)
        const newObjects: GravityObject[] = []
        for (const object of objects.value) {
            const force = forceOnObject(object)
            const forcePerKG = force.scale(1 / object.mass)
            newObjects.push({
                ...object,
                velocity: object.velocity.add(forcePerKG.scale(stepSize)),
                position: object.position.add(object.velocity.scale(stepSize)),
            })
        }
        objects.value = newObjects
    }

    useAnimationFrame(step)

    return { objects }

}

/**
 * Calculate gravitational force on an object given another object, in
 * vectorized form. Masses are assumed to be in kg, distances in meters
 * @param first First object, the object on which to calculate the force
 * @param second Other object that causes the force
 * @return The force vector in Newtons
 */
function objectForce(first: GravityObject, second: GravityObject): Vector2 {
    const distance = first.position.distanceTo(second.position) +
    DISTANCE_SMOOTHING
    const diff = second.position.subtract(first.position)
    // F = G * m1 * m2 / r^3 * (v2 - v1)
    return diff.scale(GRAV_CONSTANT * first.mass * second.mass / distance /
    distance / distance)
}