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
        /**
         * Emitted when the user clicks/taps on the icon/pin
         * @param event Pointer event from the click
         */
        click?: (event: PointerEvent) => void,
    };
</script>

<script lang="ts" setup>
    import type Vector2 from '@/util/linalg/Vector2';
    import MapIconScaled from './MapIconScaled.vue';
    import { computed, inject } from 'vue';
    import MapIconPin from './MapIconPin.vue';
    import { defaultState } from '@/util/mapState';
    import { mapStateKey } from '@/util/keys';

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

    // List of icons with sizes and positions in pixel values
    const unitSizeIcons = computed(() => icons.map((icon) => ({
        ...icon,
        position: toPixelCoords(icon.position),
        size:  icon.size / (icon.ignoreScaling ? 1 : pixelSize.value),
    })))

    // List of icons with z-index added, such that icons with higher y coord are
    // displayed on top of those with a lower y coord
    const iconsWithZ = computed(() => {
        const icons = unitSizeIcons.value
        const indexedIcons = Array.from(icons.entries())
        indexedIcons.sort(([_indexA, a], [_indexB, b]) =>
            a.position.y - b.position.y)
        const zIndices = indexedIcons.map(() => 0)
        for (const [zIndex, [index]] of indexedIcons.entries())
            zIndices[index] = zIndex
        return icons.map((icon, index) => ({
            ...icon,
            zIndex: zIndices[index]!
        }))
    })
</script>

<template>
    <div :class="$style.container">
        <template v-for="icon in iconsWithZ">
            <MapIconPin
                v-if="icon.size < showPinAt && !icon.ignoreScaling"
                :src="icon.src"
                :position="icon.position"
                @click="(event) => icon.click?.(event)"
                :hover-effect="icon.click !== undefined"
                :style="{
                    zIndex: icon.zIndex,
                    pointerEvents: icon.click ? undefined : 'none',
                }" />
            <MapIconScaled
                v-else
                :src="icon.src"
                :position="icon.position"
                :size="icon.size"
                @click="(event) => icon.click?.(event)"
                :hover-effect="icon.click !== undefined"
                :style="{
                    zIndex: icon.zIndex,
                    pointerEvents: icon.click ? undefined : 'none',
                }" />
        </template>
    </div>
</template>

<style lang="scss" module>
    .container {
        isolation: isolate;
    }
</style>