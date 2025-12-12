<script lang="ts" setup>
    import { mdiClose } from '@mdi/js';
    import SVGIcon from '@/ui/SVGIcon.vue';
    import { onClickOutside } from '@vueuse/core';
    import { useTemplateRef } from 'vue';
    import { useScrollbarWidth } from '@/util/useScrollbarWidth';

    const { visible = false, menuTitle = "" } = defineProps<{
        /** Whether the side menu is currently visible */
        visible?: boolean,
        /** Title displayed at the top of the menu */
        menuTitle?: string,
    }>()

    const emit = defineEmits<{
        /**
         * Emitted to indicate that the side menu should be closed. This
         * component doesn't handle the closing itself
         */
        (e: "close"): void,
    }>()

    /**
     * Close the side menu if it is visible. The actual closing should happen in
     * the parent element, by listening to the "close" emit. If the menu isn't
     * visible nothing is emitted
     */
    function close(): void {
        if (!visible)
            return
        emit("close")
    }

    // Clicking outside the menu (except on ignored elements), causes the menu
    // to close
    const container = useTemplateRef("container")
    onClickOutside(container, close, { ignore: [".ignore-side-menu-close"] })

    const scrollbarWidth = useScrollbarWidth(useTemplateRef("menu"))
</script>

<template>
    <div :class="[$style.container, { [$style.visible]: visible }]"
    ref="container">
        <div :class="$style.top">
            <div :class="$style.spacer" />
            <h1>{{ menuTitle }}</h1>
            <button :class="$style['close-button']" @click="close">
                <SVGIcon :path="mdiClose" :class="$style.icon" />
            </button>
        </div>
        <div :class="$style.menu" :style="{
            paddingRight: `calc(1.2em - ${scrollbarWidth}px)`
        }" ref="menu">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" module>
    @use "@/colors.scss";
    @use "./style.scss";

    .container {
        position: absolute;
        top: 0em;
        right: 0em;
        bottom: 2.5em;
        width: 17em;
        max-width: 100%;
        background-color: var(--side-menu-background-color);
        box-sizing: border-box;
        border-radius: .5em;
        box-shadow: colors.$menu-shadow;
        translate: 2em 0;
        opacity: 0;
        transition: translate .2s, opacity .2s;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        pointer-events: none;

        &.visible {
            opacity: 1;
            pointer-events: all;
            translate: 0 0;
        }

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: .6em .8em;
            background-color: var(--side-menu-head-color);
            user-select: none;

            .spacer {
                width: 2em;
            }

            h1 {
                margin: 0;
                font-size: 1.1em;
                color: var(--side-menu-head-text-color);
            }

            .close-button {
                width: 1.7em;
                height: 1.7em;
                border: none;
                background-color: transparent;
                box-sizing: border-box;
                padding: .2em;
                cursor: pointer;

                .icon {
                    fill: var(--side-menu-head-text-color);
                }

                &:hover .icon {
                    fill: color-mix(in srgb, var(--side-menu-head-text-color),
                        transparent 20%);
                }
            }
        }
    }

    .menu {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: .6em 1.2em;
        box-sizing: border-box;
        overflow-y: scroll;
        flex-shrink: 1;
        scrollbar-width: thin;
    }
</style>