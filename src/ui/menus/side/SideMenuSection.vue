<script setup lang="ts">
    const { divider } = defineProps<{
        /** Whether to show a divider above this section */
        divider?: boolean
    }>()
</script>

<template>
    <div :class="[$style.section, { [$style.divider]: divider }]">
        <slot />
    </div>
</template>

<style lang="scss" module>
    @use "./style.scss";
    .section {
        width: 100%;
        padding: .8em 0;
    }
    
    .section.divider {
        border-top: .1em solid var(--side-menu-line-color);
    }
</style>