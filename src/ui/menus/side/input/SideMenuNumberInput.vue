<script lang="ts" setup>
    import { useEventListener } from '@vueuse/core';
    import { onMounted, useTemplateRef, watch } from 'vue';

    const model = defineModel<number>({ default: 0 })
    const inputField = useTemplateRef("input")

    function input() {
        if (inputField.value == null)
            return
        const result = Number(inputField.value.value)
        if (Number.isNaN(result))
            return
        model.value = result
    }

    function updateInputValue(): void {
        if (!inputField.value || document.activeElement == inputField.value)
            return
        inputField.value.value = String(model.value)
    }

    watch(model, updateInputValue)
</script>

<template>
    <input
        :class="$style.input"
        @input="input"
        @blur="updateInputValue"
        ref="input" />
</template>

<style lang="scss" module>
    @use "./style.scss";

    .input {
        @extend %text-input;
    }
</style>