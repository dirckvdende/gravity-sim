<script lang="ts">
    /** Definition of a button inside a side menu stat */
    export type SideMenuStatButtonDef = {
        /** Name of the button */
        name: string
        /**
         * Whether the button should be displayed as "active" (different
         * styling for toggle buttons) (default false)
         */
        active?: boolean
        /** SVG path definition of the icon */
        iconPath: string
        /** Button click action */
        click?: () => void
    };
</script>

<script setup lang="ts">
    import SVGIcon from '@/components/SVGIcon.vue';

    const { buttonDef } = defineProps<{
        buttonDef: SideMenuStatButtonDef
    }>()
</script>

<template>
    <button @click="buttonDef.click" :class="[
        $style.button,
        { [$style.active]: buttonDef.active },
    ]">
        <SVGIcon :path="buttonDef.iconPath" :class="$style.svg" />
    </button>
</template>

<style lang="scss" module>
    .button {
        border: none;
        background-color: var(--side-menu-button-color);
        display: flex;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        padding: .3em;
        box-sizing: border-box;
        margin: 0 0 0 .3em;
        cursor: pointer;

        .svg {
            fill: var(--side-menu-text-color);
        }
    }

    .button.active {
        background-color: var(--side-menu-head-color);

        .svg {
            fill: var(--side-menu-head-text-color);
        }
    }
</style>

