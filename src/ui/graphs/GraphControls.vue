<script lang="ts">
    /** Specification of graph controls to display */
    export type GraphControlsDefition = {
        /** Name of the control */
        name: string
        /** Icon to display in the button (SVG path definition) */
        iconPath: string
        /** Function to call when button is clicked */
        click?: () => void
    }[];
</script>

<script setup lang="ts">
    import SVGIcon from '../SVGIcon.vue';

    const { controls } = defineProps<{
        /** List of controls to display */
        controls: GraphControlsDefition
    }>()
</script>

<template>
    <div :class="$style.container">
        <button v-for="{ iconPath, click } in controls" @click="click"
        :class="$style.button">
            <SVGIcon :path="iconPath" :class="$style.svg" />
        </button>
    </div>
</template>

<style lang="scss" module>
    .container {
        position: absolute;
        right: .3em;
        bottom: .3em;
        display: flex;
    }

    .button {
        padding: 0;
        border: none;
        width: 2em;
        height: 2em;
        padding: .15em;
        background-color: #0005;
        border-radius: .2em;
        cursor: pointer;
        user-select: none;
        outline: none;

        &:hover {
            background-color: #0007;
        }

        &:not(:first-child) {
            margin-left: .3em;
        }
    }

    .svg {
        fill: white;
    }
</style>
