<script setup lang="ts">
    const demoVersion = import.meta.env.VITE_DEMO_WATERMARK == "true"
</script>

<template>
    <div :class="$style.overlay" v-if="demoVersion">DEMO</div>
</template>

<style lang="scss" module>
    .overlay {
        pointer-events: none;
        user-select: none;
        position: fixed;
        top: 50%;
        left: 0;
        translate: 0 -50%;
        width: 100%;
        text-align: center;
        font-size: min(30vh, 30vw);
        opacity: .1;
        font-weight: 800;
        font-family: sans-serif;
        rotate: -45deg;
    }
</style>