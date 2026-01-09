<script setup lang="ts">
    import IconRenderer from '@/map/renderers/icons/IconRenderer.vue';
    import type { StyledGravityObject } from '@/util/sim/object';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { storeToRefs } from 'pinia';

    const { objects } = storeToRefs(useGravitySimStore())
    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())

    function showObjectDetails(object: StyledGravityObject): void {
        activeMenu.value = "object-details"
        focusedObject.value = object
    }
</script>

<template>
    <IconRenderer :icons="objects.map((object) => ({
        src: object.icon,
        size: object.size,
        position: object.position,
        click: () => showObjectDetails(object)
    }))" />
</template>