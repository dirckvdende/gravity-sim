<script lang="ts" setup>
    import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
    import SVGIcon from './SVGIcon.vue';
    import { ref, useTemplateRef, computed, onMounted, onUnmounted } from 'vue';
    
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
        <SVGIcon :path="mdiArrowLeft" :class="$style.icon" />
    </button>
    <button
        v-if="!atEnd"
        :class="$style['arrow-right']"
        @click="() => scroll(100)">
        <SVGIcon :path="mdiArrowRight" :class="$style.icon" />
    </button>
</template>

<style lang="scss" module>
    $shadow: 0 .15em .6em -.35em black;

    %arrow {
        position: fixed;
        bottom: .9em;
        width: 2.5em;
        height: 2.5em;
        background-color: white;
        box-shadow: $shadow;
        border-radius: 1.25em;
        border: none;
        cursor: pointer;

        .icon {
            fill: #666;
        }

        &:hover .icon {
            fill: black;
        }
    }

    .arrow-left {
        @extend %arrow;
        left: .5em;
    }

    .arrow-right {
        @extend %arrow;
        right: .5em;
    }

    .container {
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 1.8em .6em .6em .6em;
        box-sizing: border-box;
        width: 100%;
        overflow-x: scroll;
        scrollbar-width: none;

    }

    .menu {
        display: flex;
        
        & > :global(.menu-section) {
            display: flex;
            align-items: center;
            padding: 0 .4em;
            background-color: white;
            border-radius: .5em;
            box-shadow: $shadow;
            user-select: none;
            margin-right: .5em;
            flex-shrink: 0;

            & > :global(.menu-button) {
                background-color: transparent;
                border: none;
                cursor: pointer;
                font-size: .8em;
                --icon-color: #999;
                position: relative;

                :global(.menu-button-icon) {
                    width: 2em;
                    height: 2em;
                    fill: var(--icon-color);
                }

                :global(.menu-button-text) {
                    position: absolute;
                    left: 50%;
                    top: -80%;
                    translate: -50% 0;
                    user-select: none;
                    background-color: white;
                    box-shadow: $shadow;
                    font-size: .9em;
                    border-radius: .5em;
                    padding: .3em .7em;
                    display: none;
                    width: auto;
                    white-space: preserve nowrap;
                }

                &:hover {
                    :global(.menu-button-icon) {
                        fill: color-mix(in srgb, var(--icon-color), #000 20%);
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