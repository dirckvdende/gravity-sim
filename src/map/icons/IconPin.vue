<script lang="ts" setup>
    import type Vector2 from '@/util/Vector2';

    const { src, position, size = 70 } = defineProps<{
        /**
         * Source of the icon image
         */
        src: string,
        /**
         * Position of the pinpoint relative to its parent element
         */
        position: Vector2,
        /**
         * Size of the pin (height in pixels, default 50)
         */
        size?: number,
    }>()
</script>

<template>
    <div
        :class="$style.pin"
        :style="{
            height: `${size}px`,
            left: `${position.x}px`,
            top: `${position.y + 2}px`,
            translate: '-50% -100%',
        }">
        <!-- Aspect ratio 10 / 16 -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -25 100 160"
        fill="#ccc" stroke="#fff" stroke-width="8">
            <path d="
                M 10 50
                A 44 44 0 1 1 90 50
                L 50 130
                Z
            " />
        </svg>
        <img
            :src="src"
            :class="$style.icon" />
    </div>
</template>

<style lang="scss" module>
    .pin {
        position: absolute;
        aspect-ratio: 10 / 16;
        pointer-events: none;

        .svg {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }

        .icon {
            position: absolute;
            object-fit: contain;
            aspect-ratio: 1 / 1;
            top: 17%;
            left: 18%;
            width: 64%;
        }
    }
</style>