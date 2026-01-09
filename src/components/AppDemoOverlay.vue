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
        top: -.1em;
        right: .2em;
        text-align: center;
        font-size: min(10vh, 10vw);
        opacity: .1;
        font-weight: 800;
        font-family: sans-serif;
    }
</style>