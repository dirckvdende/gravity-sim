<script lang="ts" setup>
    import { useTemplateRef, watch } from 'vue';

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
        // Override default JS exponential display limits, since they're quite
        // large. Also reduce decimal digits
        inputField.value.value = Math.abs(model.value) > 1e6
            ? model.value.toExponential(6)
            : model.value.toFixed(6)
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