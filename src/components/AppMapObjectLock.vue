<script lang="ts" setup>
    import { useLockStore } from '@/stores/useLockStore';
    import { storeToRefs } from 'pinia';
    import { computed, inject, watch } from 'vue';
    import { mapStateKey } from '@/util/keys';
    import { defaultState } from '@/util/mapState';

    const { position: mapPosition } = inject(mapStateKey, defaultState())
    const { lockedObject } = storeToRefs(useLockStore())
    const objectPosition = computed(() => lockedObject.value?.position)

    watch([lockedObject, objectPosition], (
        [newObject, newPosition],
        [oldObject, oldPosition],
    ) => {
        if (!newPosition || !newObject)
            return
        // Center on object on lock
        if (!oldObject) {
            mapPosition.value = newPosition.flatten()
            return
        }
        if (!oldPosition)
            return
        const diff = newPosition.subtract(oldPosition).flatten()
        mapPosition.value = mapPosition.value.add(diff)
    })
</script>

<template></template>