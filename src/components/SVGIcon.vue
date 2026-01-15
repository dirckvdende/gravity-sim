<script lang="ts" setup>
    const {
        path,
        glow = false,
    } = defineProps<{
        path: string,
        glow?: boolean,
    }>()
</script>

<template>
    <div v-if="glow" :class="$style.container">
        <svg
            viewBox="0 0 25 25"
            style="translate: 0 1px"
            v-bind="$attrs">
            <path :d="path" />
        </svg>
        <svg
            viewBox="0 0 25 25"
            style="translate: 0 1px"
            v-bind="$attrs"
            :class="$style.glow">
            <path :d="path" />
        </svg>
    </div>
    <svg v-else
        viewBox="0 0 25 25"
        style="translate: 0 1px"
        v-bind="$attrs">
        <path :d="path" />
    </svg>
</template>

<style lang="scss" module>
    .container {
        position: relative;

        .glow {
            position: absolute;
            top: 0;
            left: 0;
            filter: blur(.2em);
            opacity: .5;
            scale: 1.1;
        }
    }
</style>