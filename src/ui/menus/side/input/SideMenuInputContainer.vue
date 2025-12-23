<script lang="ts" setup>
    const { name, suffix } = defineProps<{
        /** Name to display next to the input field */
        name: string
        /** Suffix to display after the input field (default no suffix) */
        suffix?: string
    }>()
</script>

<template>
    <div :class="$style.container">
        <div :class="$style.name"><span>{{ name }}</span></div>
        <div :class="$style.field">
            <span><slot /></span>
            <span :class="$style.suffix" v-if="suffix">{{ suffix }}</span>
        </div>
    </div>
</template>

<style lang="scss" module>
    .container {
        display: flex;
        flex-direction: row;
        width: 100%;
        box-sizing: border-box;
        margin-top: .4em;
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

        .field {
            width: 11em;
            white-space: nowrap;
            text-align: right;
            justify-content: flex-end;

            .suffix {
                color: color-mix(in srgb, var(--side-menu-text-color, black),
                    transparent 60%);
                margin-left: .5em;
            }
        }

        .field, .name {
            display: flex;
            align-items: center;
            min-height: 1.7em;
        }
    }

    .container.deep {
        margin-top: -.1em;;
    }
</style>