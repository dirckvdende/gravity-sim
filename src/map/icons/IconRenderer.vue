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
         * Size of the icon in unit coordinates (max. of width and height)
         */
        size: number,
    };
</script>

<script lang="ts" setup>
    import type Vector2 from '@/util/Vector2';
    import type { PositionRectTracker } from '../positionRectTracker';
    import Icon from './Icon.vue';
    import { computed, watch } from 'vue';
    import IconPin from './IconPin.vue';

    const {
        tracker,
        icons = [],
        showPinAt = 10,
    } = defineProps<{
        /**
         * Position rect tracker that is used to determine position and zoom
         * level
         */
        tracker: PositionRectTracker,
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

    const unitSizeIcons = computed(() => icons.map((icon) => ({
        ...icon,
        position: tracker.toPixelCoords(icon.position),
        size: icon.size / tracker.pixelSize.value,
    })))
    watch(unitSizeIcons, () => console.log(unitSizeIcons.value))
</script>

<template>
    <template v-for="icon in unitSizeIcons">
        <IconPin
            v-if="icon.size < showPinAt"
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