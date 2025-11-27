<script lang="ts" setup>
    const {
        path,
    } = defineProps<{
        path: string,
    }>()
</script>

<template>
    <svg viewBox="0 0 25 25" style="translate: 0 3px">
        <path :d="path" />
    </svg>
</template>

<style lang="scss" module>
</style>