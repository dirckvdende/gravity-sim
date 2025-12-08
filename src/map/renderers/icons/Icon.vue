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

    const emit = defineEmits<{
        /** Emitted when the user clicks/taps on the icon */
        (e: "click", event: PointerEvent): void
    }>()
</script>

<template>
    <img
        :class="$style.icon"
        :src="src"
        :style="{
            width: `${size}px`,
            height: `${size}px`,
            left: `${position.x}px`,
            top: `${position.y}px`,
            translate: '-50% -50%',
        }"
        @click="(event) => emit('click', event)" />
</template>

<style lang="scss" module>
    .icon {
        position: absolute;
        object-fit: contain;
        -webkit-user-drag: none;
        user-select: none;
    }
</style>