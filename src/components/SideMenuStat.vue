<script lang="ts" setup>
    import { unitToFormat, unitToHTML, type FormatOptions, type FormattedUnit, type UnitsList } from
    '@/util/units';
    import { computed, type ComputedRef } from 'vue';
    import type { SideMenuStatButtonDef } from
    '@/components/SideMenuStatButton.vue';
    import SideMenuStatButton from '@/components/SideMenuStatButton.vue';

    const {
        value,
        units = [{ suffix: "", scale: 1 }],
        formatOptions,
        level = 0,
        large = false,
        buttons = [],
    } = defineProps<{
        /**
         * The value of the stat to display. Displays a placeholder ("—") when
         * undefined. Displays nothing when null. Displays the literal string in
         * case of a string
         */
        value?: number | string | null
        /** List of units to use to format the value (default no units) */
        units?: UnitsList
        /** Optional formatting options */
        formatOptions?: FormatOptions
        /**
         * Depth of the stat, which can be used to create sub-stats (default 0)
         */
        level?: number
        /**
         * Whether the stat and its name should be displayed on separate lines.
         * This also allows both the stat and its name to be displayed as
         * multi-line. Shouldn't be used alongside level prop
         */
        large?: boolean
        /** Buttons to display next to the stat name (default none) */
        buttons?: SideMenuStatButtonDef[]
    }>()

    const valueFormat: ComputedRef<FormattedUnit> = computed(() => {
        if (value === null)
            return { base: "", suffix: "" }
        if (value === undefined)
            return { base: "—", suffix: "" }
        if (typeof value == "string")
            return { base: value, suffix: "" }
        return unitToFormat(value, units, formatOptions)
    })
</script>

<template>
    <div :class="[
        $style.container,
        { [$style.deep]: level > 0 },
        { [$style.large]: large },
    ]" :style="{
        '--level': level,
    }">
        <div :class="$style.name">
            <div :class="$style['level-padding']" />
            <span><slot /></span>
            <SideMenuStatButton v-for="button in buttons"
                :button-def="button" />
        </div>
        <div :class="$style.stat">
            <span class="base">{{ valueFormat.base }}</span>
            <span class="multiplier" v-if="valueFormat.exponent">
                × 10<sup class="exponent">{{ valueFormat.exponent }}</sup>
            </span>
            <span class="suffix" v-if="valueFormat.suffix != ''">
                &nbsp;{{ valueFormat.suffix }}
            </span>
        </div>
    </div>
</template>

<style lang="scss" module>
    .container {
        display: flex;
        flex-direction: row;
        width: 100%;
        box-sizing: border-box;
        margin: .4em 0;
        justify-content: space-between;
        font-size: .8em;
        color: var(--side-menu-text-color, black);
        --level: 0;

        .name {
            flex-grow: 1;
            flex-shrink: 1;
            overflow: hidden;
            text-align: left;
            justify-content: flex-start;
            color: color-mix(in srgb, var(--side-menu-text-color, black),
                transparent 60%);

            .level-padding {
                display: none;
            }

            @container not style(--level: 0) {
                .level-padding {
                    display: inline-block;
                    width: calc(var(--level, 0) * 1.75em);
                }
            }
        }

        .stat {
            width: 7em;
            overflow: hidden;
            white-space: nowrap;
            text-align: right;
            justify-content: flex-end;

            :global(.suffix) {
                color: color-mix(in srgb, var(--side-menu-text-color, black),
                    transparent 60%);
            }
        }

        .stat, .name {
            display: flex;
            align-items: center;
            min-height: 1.7em;
        }
    }

    .container.deep {
        margin-top: -.4em;
    }

    .container.large {
        flex-direction: column;

        .name {
            text-align: initial;
        }

        .stat {
            text-align: initial;
            justify-content: flex-start;
        }

        .stat, .name {
            width: 100%;
            white-space: initial;
        }
    }
</style>