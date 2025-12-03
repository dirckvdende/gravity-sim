<script lang="ts">
    /**
     * Definition of an icon that is rendered to the screen
     */
    export type RenderedIcon = {
        /**
         * Source of the icon image
         */
        src: string,
        /**
         * Position of the icon in unit coordinates
         */
        position: Vector2,
        /**
         * Size of the icon in unit coordinates (max. of width and height), or
         * pixel coordinates if ignoreScaling is set
         */
        size: number,
        /**
         * Makes the size of the icon in pixels instead of unit coordinates.
         * Position is unchanged. If this is set the icon will never appear as a
         * pin (default false)
         */
        ignoreScaling?: boolean,
    };
</script>

<script lang="ts" setup>
    import type Vector2 from '@/util/Vector2';
    import Icon from './Icon.vue';
    import { computed, inject } from 'vue';
    import IconPin from './IconPin.vue';
    import { defaultState, mapStateKey } from '@/newmap/state';

    const {
        icons = [],
        showPinAt = 10,
    } = defineProps<{
        /**
         * Array of rendered icons
         */
        icons?: RenderedIcon[],
        /**
         * Show a pin with the icon when it becomes too small. This indicates
         * the size in pixels below which a pin will be displayed. Set to zero
         * to disable pins (default 10)
         */
        showPinAt?: number,
    }>()

    const { toPixelCoords, pixelSize } = inject(mapStateKey, defaultState())

    // List of icons with sizes and positions in pixel values. The list also
    // sorted from back to front (lowest to highest y coord). The original index
    // is stored as property "index"
    const unitSizeIcons = computed(() => icons.map((icon, index) => ({
        ...icon,
        index,
        position: toPixelCoords(icon.position),
        size:  icon.size / (icon.ignoreScaling ? 1 : pixelSize.value),
    })).sort((iconA, iconB) => {
        const ignoreA = iconA.ignoreScaling ?? false
        const ignoreB = iconB.ignoreScaling ?? false
        if (ignoreA != ignoreB)
            return Number(ignoreA) - Number(ignoreB)
        return iconA.position.y - iconB.position.y
    }))
</script>

<template>
    <template v-for="icon in unitSizeIcons" :key="icon.index">
        <IconPin
            v-if="icon.size < showPinAt && !icon.ignoreScaling"
            :src="icon.src"
            :position="icon.position" />
        <Icon
            v-else
            :src="icon.src"
            :position="icon.position"
            :size="icon.size" />
    </template>
</template>

<style lang="scss" module>
</style>