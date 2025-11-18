<script setup lang="ts">
    import { ref } from 'vue';
    import Vector2 from './util/Vector2';
    import DragView, { DragViewState } from './map/DragView.vue';

    const objPos = ref(Vector2.Zero)

    function updatePosition(state: DragViewState): void {
        objPos.value = state.toPixelCoords(Vector2.Zero)
    }
</script>

<template>
    <DragView
        @update="updatePosition"
        :class="$style.target">
        <div :class="$style.test" :style="{
            top: `${objPos.y}px`,
            left: `${objPos.x}px`,
            translate: `-50% -50%`
        }" />
    </DragView>
</template>

<style lang="scss" module>
    .target {
        position: relative;
        background-color: red;
        width: 50%;
        height: 300px;
        overflow: hidden;
    }

    .test {
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: black;
    }
</style>
