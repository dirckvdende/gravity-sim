<script lang="ts">
    export type SideMenuBottomButton = {
        /** SVG path of the icon to display (default no icon) */
        iconPath?: string
        /** Text to display (default no text) */
        text?: string
        /** Function to call when the button is clicked */
        click?: () => void
    }
</script>

<script setup lang="ts">
    import SVGIcon from '@/ui/SVGIcon.vue';

    const { buttons } = defineProps<{
        /** The buttons to display */
        buttons: SideMenuBottomButton[]
    }>()
</script>

<template>
    <div :class="$style.container">
        <button v-for="{ iconPath, text, click } in buttons"
        :class="$style.button" @click="click">
            <SVGIcon v-if="iconPath" :path="iconPath" :class="$style.icon" />
            <span v-if="text" :class="$style.text">{{ text }}</span>
        </button>
    </div>
</template>

<style lang="scss" module>
    .container {
        display: flex;
        bottom: 0;
        width: 100%;
        justify-content: center;
        box-sizing: border-box;
        padding: .7em 0;
        background-color: var(--side-menu-background-color);
    }

    .button {
        display: flex;
        align-items: center;
        height: 2em;
        box-sizing: border-box;
        padding: 0 .8em;
        font-size: 1em;
        cursor: pointer;
        border: none;
        border-radius: .4em;
        background-color: var(--side-menu-button-color);

        &:hover {
            background-color: color-mix(in srgb,
                var(--side-menu-button-color), black 5%);
        }

        .icon {
            height: 1.2em;
            width: 1.2em;
            fill: var(--side-menu-text-color);
        }

        .text {
            color: var(--side-menu-text-color);
            font-size: .9em;
        }

        .icon + .text {
            margin-left: .5em;
        }

        &:not(:first-child) {
            margin-left: .5em;
        }
    }
</style>