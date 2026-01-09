<script lang="ts" setup>
    const { src } = defineProps<{
        /** Image source URL */
        src: string
    }>()
</script>

<template>
    <div :class="$style.container">
        <img :src="src" />
    </div>
</template>

<style lang="scss" module>
    .container {
        display: flex;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
        padding: 0 3em;
        margin: 1em 0;

        & > img {
            width: 6em;
            max-width: 100%;
        }
    }
</style>