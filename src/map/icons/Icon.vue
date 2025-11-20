<script lang="ts" setup>
    import type Vector2 from '@/util/Vector2';

    const { src, position, size } = defineProps<{
        /**
         * Source of the icon image
         */
        src: string,
        /**
         * Position of the icon relative to its parent element
         */
        position: Vector2,
        /**
         * Size of the icon (max. of width and height)
         */
        size: number,
    }>()
</script>

<template>
    <img
        :class="$style.icon"
        :src="src"
        :style="{
            width: `${size}px`,
            height: `${size}px`,
            left: `calc(${position.x}px - ${size / 2}px)`,
            top: `calc(${position.y}px - ${size / 2}px)`,
        }" />
</template>

<style lang="scss" module>
    .icon {
        position: absolute;
        object-fit: contain;
    }
</style>