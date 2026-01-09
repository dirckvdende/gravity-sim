<script lang="ts" setup>
    const model = defineModel<string>({ default: "" })
</script>

<template>
    <input :class="$style.input" v-model="model" />
</template>

<style lang="scss" module>
    @use "@/assets/scss/text-input.scss";

    .input {
        @extend %text-input;
    }
</style>