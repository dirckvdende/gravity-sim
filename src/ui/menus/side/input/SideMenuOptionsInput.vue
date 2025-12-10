<script lang="ts" setup generic="OptionValue">
    import { onClickOutside } from '@vueuse/core';
    import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

    const { options } = defineProps<{
        /**
         * Different options to let the user choose between, with a value to
         * pass back and the name to display to the user
         */
        options: {
            value: OptionValue
            name: string
        }[]
    }>()

    // Currently selected option
    const selected = ref(options[0])
    // Value of the selected option
    const value = computed(() =>
        !selected.value ? undefined : selected.value.value)
    // Expose the value
    defineExpose({ value })

    // Input field element
    const inputField = useTemplateRef("input-field")

    // When selected value changes, update input field to display the new value
    watch(selected, updateInputField)
    
    /**
     * Update the selected option with a new value
     * @param option The option to select
     */
    function selectOption(option: { value: OptionValue, name: string }): void {
        selected.value = option
        updateInputField()
        dropdownVisible.value = false
    }
    
    /** Clear the input field value */
    function clearInputField(): void {
        if (!inputField.value)
            return
        inputField.value.value = ""
    }

    /** Update the input field value to reflect the currently selected option */
    function updateInputField(): void {
        if (!inputField.value)
            return
        inputField.value.value = selected.value?.name ?? ""
    }

    onMounted(updateInputField)

    const dropdownVisible = ref(false)

    function onFocus(): void {
        clearInputField()
        dropdownVisible.value = true
    }

    onClickOutside(useTemplateRef("dropdown"), () => {
        dropdownVisible.value = false
    }, { ignore: [inputField] })
</script>

<template>
    <div :class="$style.container">
        <input :class="$style.input" type="text" @focus="onFocus"
            ref="input-field" />
        <div :class="$style.dropdown" :style="{
            display: dropdownVisible ? undefined : 'none'
        }" ref="dropdown">
            <button
                v-for="option in options"
                :class="$style.option"
                @click="() => selectOption(option)">{{ option.name }}</button>
        </div>
    </div>
</template>

<style lang="scss" module>
    @use "./style.scss";

    .container {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .input {
            @extend %text-input;
        }

        .dropdown {
            user-select: none;
            display: block;
            background-color: var(--side-menu-option-background-color);
            margin-top: .25em;
            border-radius: .3em;
            box-sizing: border-box;
            width: 100%;
            padding: .2em;

            .option {
                text-align: start;
                box-sizing: border-box;
                padding: .3em .8em;
                display: block;
                width: 100%;
                border: none;
                background-color: transparent;
                border-radius: .3em;
                cursor: pointer;

                &:hover {
                    background-color: var(--side-menu-option-hover-color);
                }
            }
        }
    }
</style>