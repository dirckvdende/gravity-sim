<script lang="ts" setup>
    import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
    import SVGIcon from './SVGIcon.vue';
    import { ref, useTemplateRef, computed, onMounted } from 'vue';
    
    const container = useTemplateRef("container")
    const menu = useTemplateRef("menu")
    const scrollWidth = ref(0)
    const clientWidth = ref(0)
    const scrollLeft = ref(0)
    const atEnd = computed(() =>
        clientWidth.value + scrollLeft.value > scrollWidth.value - 2)
    const atStart = computed(() => scrollLeft.value < 2)

    /**
     * Update the refs related to scrolling the bottom menu
     */
    function updateScrollData(): void {
        if (container.value == null)
            return
        scrollWidth.value = container.value.scrollWidth
        clientWidth.value = container.value.clientWidth
        scrollLeft.value = container.value.scrollLeft
    }

    /**
     * Scroll the bottom menu
     * @param diff Difference by which to scroll (positive = right, negative =
     * left)
     */
    function scroll(diff: number): void {
        container.value?.scrollBy({
            left: diff,
            top: 0,
            behavior: "smooth",
        })
    }

    onMounted(() => {
        if (!container.value || !menu.value)
            return
        container.value.addEventListener("scroll", updateScrollData)
        const observer = new ResizeObserver(updateScrollData)
        observer.observe(container.value)
        observer.observe(menu.value)
        updateScrollData()
    })
</script>

<template>
    <div :class="$style.container" ref="container">
        <div :class="$style.menu" ref="menu">
            <slot />
            <!-- Extra div for spacing at the end -->
            <div style="width: 2em; flex-shrink: 0;"></div>
        </div>
    </div>
    <button
        v-if="!atStart"
        :class="$style['arrow-left']"
        @click="() => scroll(-100)">
        <SVGIcon :path="mdiChevronLeft" :class="$style.icon" />
    </button>
    <button
        v-if="!atEnd"
        :class="$style['arrow-right']"
        @click="() => scroll(100)">
        <SVGIcon :path="mdiChevronRight" :class="$style.icon" />
    </button>
</template>

<style lang="scss" module>
    @use "@/colors.scss";

    %arrow {
        position: absolute;
        bottom: .2em;
        width: 2.5em;
        height: 2.5em;
        background-color: var(--bottom-menu-background-color, white);
        box-shadow: colors.$menu-shadow;
        border-radius: 1.25em;
        border: none;
        cursor: pointer;
        border: .2em solid var(--background-color, white);
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            fill: var(--bottom-menu-icon-color, #999);
            translate: 0 1px !important;
        }

        &:hover .icon {
            fill: color-mix(in srgb, var(--bottom-menu-icon-color, #999),
                var(--bottom-menu-icon-color-mix, black) 20%);
        }
    }

    .arrow-left {
        @extend %arrow;
        left: 0;
    }

    .arrow-right {
        @extend %arrow;
        right: 0;
    }

    .container {
        position: absolute;
        bottom: -.6em;
        left: -.6em;
        right: -.6em;
        padding: 1.8em .6em .6em .6em;
        box-sizing: border-box;
        overflow-x: scroll;
        scrollbar-width: none;
        pointer-events: none;
    }

    .menu {
        display: flex;
        pointer-events: all;
        
        & > :global(.menu-section) {
            display: flex;
            align-items: center;
            padding: 0 .4em;
            background-color: var(--bottom-menu-background-color, white);
            border-radius: .5em;
            box-shadow: colors.$menu-shadow;
            user-select: none;
            margin-right: .5em;
            flex-shrink: 0;

            & > :global(.menu-button) {
                background-color: transparent;
                border: none;
                cursor: pointer;
                font-size: .8em;
                --icon-color: var(--bottom-menu-icon-color, #999);
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 2.6em;
                outline: none;

                :global(.menu-button-path-icon) {
                    width: 2em;
                    height: 2em;
                    fill: var(--icon-color);
                }

                :global(.menu-button-icon) {
                    width: 2em;
                    height: 2em;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    padding: .1em;

                    & > img {
                        flex-grow: 1;
                        flex-shrink: 1;
                        max-width: 100%;
                        max-height: 100%;
                    }
                }

                :global(.menu-button-text) {
                    position: absolute;
                    left: 50%;
                    top: -80%;
                    translate: -50% 0;
                    user-select: none;
                    background-color: var(--bottom-menu-background-color, 
                        white);
                    box-shadow: colors.$menu-shadow;
                    font-size: .9em;
                    border-radius: .5em;
                    padding: .3em .7em;
                    display: none;
                    width: auto;
                    white-space: preserve nowrap;
                }

                &:hover {
                    :global(.menu-button-path-icon) {
                        fill: color-mix(in srgb, var(--icon-color),
                            var(--bottom-menu-icon-color-mix, black) 20%);
                    }

                    :global(.menu-button-text) {
                        display: block;
                    }
                }
            }

            & > :global(.menu-text) {
                width: 7em;
                text-align: center;
                font-size: .9em;
                font-weight: 500;
            }
        }
    }
</style>