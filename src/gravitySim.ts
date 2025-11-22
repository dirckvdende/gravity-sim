
import Vector2 from "@/util/Vector2"
import { ref, toRef, type MaybeRefOrGetter, type Ref } from "vue"

// Gravitational constant in N * m^2 / kg^2. In the simulation we assume units
// of distance are meters and units of mass are kg
const GRAV_CONSTANT = 6.6743e-11
// Factor added to the distance between objects when calculating gravitational
// forces
const DISTANCE_SMOOTHING = 1e-5

/**
 * An object in the gravity sim
 */
export type GravityObject = {
    /** Position of the object */
    position: Vector2,
    /** Velocity vector of the object */
    velocity: Vector2,
    /** Mass of the object */
    mass: number,
    /** Size (diameter) of the object */
    size: number,
    /** Icon used to display the object */
    icon: string,
}

/**
 * Options passed to the gravity sim composable
 */
export type GravitySimOptions = {
    /** Time units (seconds) of every simulation step (default .01) */
    stepSize?: number
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

    const objects = ref<GravityObject[]>([])
    const optionsRef = toRef(options)

    function forceOnObject(object: GravityObject): Vector2 {
        let total = Vector2.Zero
        for (const other of objects.value) {
            if (other == object)
                continue
            total = total.add(objectForce(object, other))
        }
        return total
    }

    function step(): void {
        const newObjects: GravityObject[] = []
        const stepSize = optionsRef.value?.stepSize ?? .01
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

    const animationCallback = () => {
        step()
        requestAnimationFrame(animationCallback)
    }
    requestAnimationFrame(animationCallback)

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