<script lang="ts" setup>
    import { useTemplateRef, watch } from 'vue';

    const { validator } = defineProps<{
        /**
         * An optional validator that gets called any time the user edits the
         * value. If the value is not valid the actual model value isn't updated
         */
        validator?: (value: number) => boolean
    }>()

    const model = defineModel<number>({ default: 0 })
    const inputField = useTemplateRef("input-field")

    function input() {
        if (inputField.value == null)
            return
        const result = Number(inputField.value.value)
        if (Number.isNaN(result))
            return
        if (!(validator?.(result) ?? true))
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

    watch([model, inputField], updateInputValue)
</script>

<template>
    <input
        :class="$style.input"
        @input="input"
        @blur="updateInputValue"
        ref="input-field" />
</template>

<style lang="scss" module>
    @use "@/assets/scss/text-input.scss";

    .input {
        @extend %text-input;
    }
</style>