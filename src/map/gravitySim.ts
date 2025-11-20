
import Vector2 from "@/util/Vector2"
import { ref, toRef, type MaybeRefOrGetter, type Ref } from "vue"

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
    /** Time units of every simulation step (default .01) */
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

    function step(): void {
        const newObjects: GravityObject[] = []
        const stepSize = optionsRef.value?.stepSize ?? .01
        for (const object of objects.value) {
            let force = Vector2.Zero
            for (const other of objects.value)
                force = force.add(other.position.subtract(object.position)
                .scale(other.mass))
            newObjects.push({
                ...object,
                velocity: object.velocity.add(force.scale(stepSize)),
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