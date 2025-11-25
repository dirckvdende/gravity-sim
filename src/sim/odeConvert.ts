
import { type GravityObject } from "./object";
import Vector2 from "@/util/Vector2";
import { GRAV_CONSTANT, DISTANCE_SMOOTHING } from "./constants";

/**
 * Convert an array of objects to an array with positions and velocities of the
 * objects, which has twice the length of the original array
 * @param objects Objects to convert
 * @returns An array of alternating position and velocity vectors
 */
export function objectsToState(objects: GravityObject[]): Vector2[] {
    const out: Vector2[] = []
    for (const object of objects) {
        out.push(object.position)
        out.push(object.velocity)
    }
    return out
}

/**
 * Convert a state into positions and velocities and put these into an array of
 * objects
 * @param state State to convert
 * @param objects Objects to put the position and velocity into, from the state
 */
export function stateToObjects(state: Vector2[], objects: GravityObject[]): void
{
    if (state.length != 2 * objects.length)
        throw new Error("State and objects lengths don't match")
    for (const [index, object] of objects.entries()) {
        object.position = state[index * 2]!
        object.velocity = state[index * 2 + 1]!
    }
}

/**
 * Get a slope function given a list of objects
 * @param objects Objects array, of which the masses will be used to determine
 * the slope
 * @returns A function that returns the slope based on the current state
 */
export function slopeFunction(objects: GravityObject[]): (state: Vector2[]) =>
Vector2[] {
    const masses = objects.map((object) => object.mass)
    return (state) => {
        if (state.length != 2 * masses.length)
            throw new Error("Invalid state length")
        const slope = state.map(() => Vector2.Zero)
        for (const [index, mass] of masses.entries()) {
            slope[index * 2] = state[index * 2 + 1]!
            slope[index * 2 + 1] = forceOn(index, state, masses).scale(1 / mass)
        }
        return slope
    }
}

/**
 * Calculate the total force acting on an object
 * @param index Index of the object
 * @param state Current state
 * @param masses Masses of all objects
 * @returns The force acting on the object from the other objects
 */
function forceOn(index: number, state: Vector2[], masses: number[]): Vector2 {
    const mass = masses[index]!
    const pos = state[index * 2]!
    let total = Vector2.Zero
    for (const [otherIndex, otherMass] of masses.entries()) {
        if (otherIndex == index)
            continue
        const otherPos = state[otherIndex * 2]!
        const diff = otherPos.subtract(pos)
        const distance = diff.length() + DISTANCE_SMOOTHING
        const force = diff.scale(GRAV_CONSTANT * mass * otherMass /
        Math.pow(distance, 3))
        total = total.add(force)
    }
    return total
}