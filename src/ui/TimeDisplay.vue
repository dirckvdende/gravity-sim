<script lang="ts" setup>
    import { useSimStore } from '@/stores/sim';
    import { storeToRefs } from 'pinia';
    import { onMounted, useTemplateRef, watch } from 'vue';

    const { timestamp } = storeToRefs(useSimStore())
    const input = useTemplateRef("input")

    function formatDate(date: Date): string {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    function dateFromFormat(format: string): Date | null {
        const timestamp = Date.parse(format)
        if (Number.isNaN(timestamp))
            return null
        return new Date(timestamp)
    }

    let changed = false

    function onBlur(): void {
        if (!input.value || !changed)
            return
        const date = dateFromFormat(input.value.value)
        if (date == null)
            return
        timestamp.value = date
        changed = false
    }

    function detectChange(): void {
        changed = true
    }

    function blur(): void {
        if (!input.value)
            return
        input.value.blur()
    }

    function updateInputContent(time: Date) {
        if (!input.value)
            return
        if (input.value == document.activeElement)
            return
        input.value.value = formatDate(time)
    }

    watch(timestamp, updateInputContent)
    onMounted(() => updateInputContent(timestamp.value))
</script>

<template>
    <div :class="$style.container">
        <form action="javascript:void(0)" @submit="blur">
            <input type="text" ref="input" @blur="onBlur" @input="detectChange"
            :class="$style.input" />
        </form>
    </div>
</template>

<style lang="scss" module>
    .container {
        position: fixed;
        padding: 1em;
        box-sizing: border-box;
        max-width: 100%;
        top: env(safe-area-inset-top, 0px);
        left: 0;
        display: block;
        padding-top: max(1em - env(safe-area-inset-top, 0px), 0px);

        .input {
            font-size: .7em;
            margin: 0;
            padding: .3em .7em;
            border: none;
            outline: none;
            background-color: color-mix(in srgb, var(--time-background-color),
                transparent 50%);
            color: var(--time-text-color);
            border-radius: .3em;
            width: 11em;
            font-family: inherit;
            font-weight: 700;

            &:hover, &:focus {
                background-color: var(--time-background-color);
            }
        }
    }
</style>