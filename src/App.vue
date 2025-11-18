<script setup lang="ts">
    import { ref } from 'vue';
    import DragTarget from './map/DragTarget.vue';
    import Vector2 from './util/Vector2';

    const position = ref(Vector2.Zero)

    function updatePosition(diff: Vector2): void {
        position.value = position.value.add(diff)
    }
</script>

<template>
    <DragTarget
        @pan="updatePosition"
        @zoom="(amt) => console.log('zoom', amt)"
        :class="$style.target">
        <div :class="$style.test" :style="{
            top: `${-position.y}px`,
            left: `${-position.x}px`,
        }" />
    </DragTarget>
</template>

<style lang="scss" module>
    .target {
        position: relative;
        background-color: red;
        width: 400px;
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
