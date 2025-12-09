<script lang="ts" setup>
    import { unitToHTML, type FormatOptions, type UnitsList } from
    '@/util/units';
    import { computed } from 'vue';

    const {
        value,
        units = [{ suffix: "", scale: 1 }],
        formatOptions,
        level = 0,
    } = defineProps<{
        /**
         * The value of the stat to display. Displays a placeholder ("N/A") when
         * undefined. Displays nothing when null
         */
        value?: number | null
        /** List of units to use to format the value (default no units) */
        units?: UnitsList
        /** Optional formatting options */
        formatOptions?: FormatOptions
        /**
         * Depth of the stat, which can be used to create sub-stats (default 0)
         */
        level?: number
    }>()

    const displayValue = computed(() => {
        if (value === null)
            return ""
        if (value === undefined)
            return "N/A"
        return unitToHTML(value, units, formatOptions)
    })
</script>

<template>
    <div :class="[
        $style.container,
        { [$style.deep]: level > 0 },
    ]">
        <div :class="$style.name"><div v-if="level > 0" :style="{
            display: 'inline-block',
            width: `${level}em`,
        }" /><slot /></div>
        <div :class="$style.stat" v-html="displayValue"></div>
    </div>
</template>

<style lang="scss" module>
    .container {
        display: flex;
        flex-direction: row;
        width: 100%;
        box-sizing: border-box;
        padding: 0 1.2em;
        margin: .4em 0;
        justify-content: space-between;
        font-size: .8em;
        color: var(--side-menu-text-color, black);

        .name {
            flex-grow: 1;
            flex-shrink: 1;
            overflow: hidden;
            color: color-mix(in srgb, var(--side-menu-text-color, black),
                transparent 60%);
        }

        .stat {
            width: 7em;
            overflow: hidden;
            white-space: nowrap;
            text-align: right;

            :global(.suffix) {
                color: color-mix(in srgb, var(--side-menu-text-color, black),
                    transparent 60%);
            }
        }
    }

    .container.deep {
        margin: 0;
    }
</style>