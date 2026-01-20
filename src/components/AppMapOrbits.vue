<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { onMounted, onUnmounted, useTemplateRef } from 'vue';
    import { useOrbitsStore } from '@/stores/useOrbitsStore';
    import MapWebGL from '@/components/MapWebGL.vue';
    import MapWebGLPath from '@/components/MapWebGLPath.vue';

    const { showOrbits, darkMode } = storeToRefs(useSettingsStore())
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
    <MapWebGL>
        <MapWebGLPath
            v-if="showOrbits"
            v-for="{ id, position } in objects"
            :key="id"
            :head="position"
            ref="orbits"
            :color="darkMode
                ? [0.2, 0.263, 0.357, 1]
                : [0.67, 0.67, 0.67, 1]" />
    </MapWebGL>
</template>