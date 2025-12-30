<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import DynamicPathRenderer from './DynamicPathRenderer.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { onMounted, onUnmounted, useTemplateRef } from 'vue';
    import { useOrbitsStore } from '@/stores/useOrbitsStore';
    import WebGLRenderer from '@/map/renderers/webgl/WebGLRenderer.vue';
    import TriangleStripRenderer from
        '@/map/renderers/webgl/TriangleStripRenderer.vue';

    const { showOrbits } = storeToRefs(useSettingsStore())
    const { objects } = storeToRefs(useGravitySimStore())

    const orbits = useTemplateRef("orbits")
    /** Clear all orbits */
    function clear(): void {
        if (orbits.value == null)
            return
        for (const orbit of orbits.value)
            orbit?.clear()
    }

    const { clearCallbacks } = storeToRefs(useOrbitsStore())
    onMounted(() => clearCallbacks.value.push(clear))
    onUnmounted(() => clearCallbacks.value = clearCallbacks.value.filter((f) =>
        f != clear))
</script>

<template>
    <!-- <DynamicPathRenderer
        v-if="showOrbits"
        v-for="{ id, position} in objects"
        :key="id"
        :point="position"
        ref="orbits"
        :min-angle="Math.PI / 200" /> -->
    <WebGLRenderer>
        <TriangleStripRenderer
            v-if="showOrbits"
            v-for="{ id, position } in objects"
            :key="id"
            :head="position"
            ref="orbits" />
    </WebGLRenderer>
</template>