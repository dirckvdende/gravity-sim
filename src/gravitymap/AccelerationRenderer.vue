<script setup lang="ts">
    import { defaultState, mapStateKey } from '@/map/state';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { storeToRefs } from 'pinia';
    import { computed, inject } from 'vue';
    import ArrowRenderer from './ArrowRenderer.vue';
    import type Vector2 from '@/util/linalg/Vector2';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import type { GravityObject } from '@/sim/object';
    import { forceOnObject } from '@/sim/odeConvert';

    // Mass added to every object's mass, and once extra to the total mass to
    // avoid division by zero
    const EXTRA_MASS = 1e-8
    // Arrow length will be this scale multiplied with sqrt(acceleration *
    //  e^zoomLevel) / sqrt(totalMass * e^zoomLevel) / e^zoomLevel
    const ARROW_SCALE = 1e9
    // Length cutoff in pixels above which arrows are no longer rendered
    const LENGTH_CUTOFF = 200

    const { pixelSize } = inject(mapStateKey, defaultState())
    const { objects } = storeToRefs(useGravitySimStore())
    const totalMass = computed(() =>
        objects.value.reduce((prev, cur) => prev + cur.mass + EXTRA_MASS, 0)
        + EXTRA_MASS)
    const { showAccelerationArrows } = storeToRefs(useSettingsStore())

    /**
     * Get the acceleration of an object
     * @param object The object to get the acceleration of
     * @return The acceleration vector
     */
    function objectAcceleration(object: GravityObject): Vector2 {
        // TODO: Probably want to restructure code such that this isn't
        // calculated multiple times
        const mass = object.mass + EXTRA_MASS
        const force = forceOnObject(object, objects.value)
        return force.scale(1 / mass)
    }

    const arrows = computed(() => {
        if (!showAccelerationArrows.value)
            return []
        const out: {
            start: Vector2
            end: Vector2
        }[] = []
        for (const object of objects.value) {
            const acceleration = objectAcceleration(object)
            const arrowSizePixels = ARROW_SCALE * Math.sqrt(acceleration.length() * pixelSize.value)
                / Math.sqrt(totalMass.value / pixelSize.value)
            if (arrowSizePixels > LENGTH_CUTOFF)
                continue
            const arrowSize = arrowSizePixels * pixelSize.value
            out.push({
                start: object.position,
                end: object.position.add(acceleration.normalize()
                    .scale(arrowSize))
            })
        }
        return out
    })

</script>

<template>
    <ArrowRenderer
        v-for="arrow in arrows"
        :start="arrow.start"
        :end="arrow.end"
        color="var(--accent-color-red)" />
</template>