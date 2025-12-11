<script lang="ts" setup generic="OptionValue">
    import { onClickOutside } from '@vueuse/core';
    import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

    const { options, maxItems = 5 } = defineProps<{
        /**
         * Different options to let the user choose between, with a value to
         * pass back and the name to display to the user. An icon can also be
         * passed (as a URL), which will be displayed on the right of the input
         * field
         */
        options: {
            value: OptionValue
            name: string
            icon?: string
        }[]
        /** Maximum number of items to display in the dropdown (default 5) */
        maxItems?: number
    }>()

    const emit = defineEmits<{
        /** Called when the current value updated */
        (e: "update", value: OptionValue | undefined): void
    }>()

    // Currently selected option
    const selected = ref(options[0])
    // Reset selected option when options list changes and selected option is
    // not in it
    watch(() => options, (newOptions) => {
        if (!selected.value)
            return
        if (newOptions.findIndex((option) =>
            option.value == selected.value?.value) != -1)
            return
        selected.value = newOptions[0]
    }, { deep: true })
    // Value of the selected option
    const value = computed(() =>
        !selected.value ? undefined : selected.value.value)
    // Emit event once value updated
    watch(value, (v) => emit("update", v as OptionValue | undefined), {
        immediate: true,
    })

    // Input field element
    const inputField = useTemplateRef("input-field")
    // Input field value, should only be modified through this ref
    const text = ref("")

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
        text.value = ""
    }

    /** Update the input field value to reflect the currently selected option */
    function updateInputField(): void {
        text.value = selected.value?.name ?? ""
    }

    onMounted(updateInputField)

    // Ref that indicates if the dropdown is currently visible
    const dropdownVisible = ref(false)

    /**
     * Function called when the input element gains focus
     */
    function onFocus(): void {
        clearInputField()
        dropdownVisible.value = true
    }

    // Hide dropdown when clicking outside it
    onClickOutside(useTemplateRef("dropdown"), () => {
        dropdownVisible.value = false
        updateInputField()
    }, { ignore: [inputField] })

    const displayedOptions = computed(() => options.filter(({ name }) =>
        name.toUpperCase().includes(text.value.toUpperCase())
    ).slice(0, maxItems))
</script>

<template>
    <div :class="$style.container">
        <input :class="$style.input" type="text" @focus="onFocus"
            ref="input-field" v-model="text" />
        <img
            v-if="selected?.icon"
            :src="selected.icon"
            :class="$style['main-icon']" />
        <div :class="$style.dropdown" :style="{
            display: dropdownVisible ? undefined : 'none'
        }" ref="dropdown">
            <button
                v-for="option in displayedOptions"
                :class="$style.option"
                @click="() => selectOption(option)">
                <span>{{ option.name }}</span>
                <img
                    v-if="option?.icon"
                    :src="option.icon"
                    :class="$style.icon" />
            </button>
            <p
                v-if="displayedOptions.length == 0"
                :class="$style['no-results']">No results found</p>
        </div>
    </div>
</template>

<style lang="scss" module>
    @use "./style.scss";

    .container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;

        .input {
            @extend %text-input;
            padding-right: 2em;
        }

        .main-icon {
            position: absolute;
            user-select: none;
            pointer-events: none;
            right: .5em;
            top: .4em;
            object-fit: contain;
            height: 1.4em;
            width: 1.4em;
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
                position: relative;

                &:hover {
                    background-color: var(--side-menu-option-hover-color);
                }

                .icon {
                    position: absolute;
                    user-select: none;
                    pointer-events: none;
                    right: .5em;
                    top: .25em;
                    object-fit: contain;
                    height: 1.4em;
                    width: 1.4em;
                }
            }

            .no-results {
                margin: .3em 0;
                opacity: .5;
                user-select: none;
                font-size: .8em;
                font-style: italic;
                padding: 0 1em;
                text-align: start;
            }
        }
    }
</style>