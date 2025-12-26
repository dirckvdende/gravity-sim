<script setup lang="ts">
    import { defaultState, mapStateKey } from '@/map/state';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { storeToRefs } from 'pinia';
    import { computed, inject } from 'vue';
    import ArrowRenderer from './ArrowRenderer.vue';
    import type Vector2 from '@/util/linalg/Vector2';

    // Mass added to the mass total to avoid division by zero
    const EXTRA_MASS = 1e-6
    // Arrow length will be this scale multiplied with velocity / sqrt(totalMass
    //  * e^zoomLevel) / e^zoomLevel
    const ARROW_SCALE = 1e8

    const { pixelSize } = inject(mapStateKey, defaultState())
    const { objects } = storeToRefs(useGravitySimStore())
    const totalMass = computed(() =>
        objects.value.reduce((prev, cur) => prev + cur.mass, 0) + EXTRA_MASS)
    
    const arrows = computed(() => {
        const out: {
            start: Vector2
            end: Vector2
        }[] = []
        for (const object of objects.value) {
            const arrowSize = ARROW_SCALE * object.velocity.length()
                / Math.sqrt(totalMass.value / pixelSize.value) * pixelSize.value
            out.push({
                start: object.position,
                end: object.position.add(object.velocity.normalize()
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
        :end="arrow.end" />
</template>