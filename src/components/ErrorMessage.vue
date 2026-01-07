<script lang="ts" setup>
    const { message } = defineProps<{
        /** Error message to display. Set to null to not display error */
        message: string | null
    }>()
</script>

<template>
    <div :class="$style.container" v-if="message != null">{{ message }}</div>
</template>

<style lang="scss" module>
    .container {
        display: block;
        background-color: var(--accent-color-red);
        color: white;
        border-radius: .55em;
        box-sizing: border-box;
        padding: .3em 1em;
        margin: .8em 0;
        font-size: .9em;
    }
</style>