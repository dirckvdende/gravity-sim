<script lang="ts" setup>
    import { mdiClose } from '@mdi/js';
    import SVGIcon from './SVGIcon.vue';

    const { visible = false, menuTitle = "" } = defineProps<{
        /** Whether the side menu is currently visible */
        visible?: boolean,
        /** Title displayed at the top of the menu */
        menuTitle?: string,
    }>()

    const emit = defineEmits<{
        (e: "close"): void,
    }>()
</script>

<template>
    <div :class="[$style.container, { [$style.visible]: visible }]">
        <div :class="$style.top">
            <div :class="$style.spacer" />
            <h1>{{ menuTitle }}</h1>
            <button :class="$style['close-button']" @click="emit('close')">
                <SVGIcon :path="mdiClose" :class="$style.icon" />
            </button>
        </div>
        <hr />
        <div :class="$style.menu">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" module>
    @use "@/colors.scss";

    %hr {
        border: none;
        width: calc(100% - 2em);
        height: .1em;
        margin: 0 1em;
        background-color: var(--side-menu-line-color);
    }

    .container {
        position: absolute;
        top: 0em;
        right: 0em;
        bottom: 2.5em;
        width: 16em;
        max-width: 100%;
        background-color: var(--side-menu-background-color);
        box-sizing: border-box;
        border-radius: .5em;
        box-shadow: colors.$menu-shadow;
        translate: 2em 0;
        opacity: 0;
        transition: translate .2s, opacity .2s;
        padding: .5em 0 0 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &.visible {
            opacity: 1;
            translate: 0 0;
        }

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: .6em .8em;

            .spacer {
                width: 2em;
            }

            h1 {
                margin: 0;
                font-size: 1.3em;
            }

            .close-button {
                width: 2em;
                height: 2em;
                border: none;
                background-color: transparent;
                padding: 0;
                box-sizing: border-box;
                padding: .2em;
                cursor: pointer;

                .icon {
                    fill: var(--side-menu-icon-color);
                }

                &:hover .icon {
                    fill: color-mix(in srgb, var(--side-menu-icon-color),
                        black 20%);
                }
            }
        }

        hr {
            @extend %hr;
        }
    }

    .menu {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: .6em;
        overflow-y: auto;
        flex-shrink: 1;

        & > :global(.menu-section) {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin: .3em 0;

            & > :global(.menu-button) {
                width: calc(100% - 2em);
                font-size: 1em;
                display: flex;
                height: 3.4em;
                align-items: center;
                box-sizing: border-box;
                margin: .2em 1em;
                border: none;
                background-color: var(--side-menu-button-color);
                border-radius: .5em;
                padding: 0 1em;
                cursor: pointer;

                &:hover {
                    background-color: color-mix(in srgb,
                        var(--side-menu-button-color), black 5%);
                }

                :global(.menu-button-path-icon) {
                    height: 2em;
                    width: 2em;
                    fill: var(--side-menu-icon-color);
                }

                :global(.menu-button-icon) {
                    height: 2em;
                    width: 2em;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;

                    & > img {
                        flex-grow: 1;
                        flex-shrink: 1;
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
                :global(.menu-button-text) {
                    margin-left: 1em;
                    font-size: 1em;
                }
            }

            & > :global(.menu-text) {
                width: 100%;
                box-sizing: border-box;
                padding: 0 1em;
                text-align: center;
                font-weight: 800;
                font-size: .9em;
                color: var(--side-menu-icon-color);
            }

            &:not(:last-child)::after {
                @extend %hr;
            }
        }
    }
</style>