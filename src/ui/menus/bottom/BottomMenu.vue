<script lang="ts" setup>
    import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
    import SVGIcon from '@/ui/SVGIcon.vue';
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
    <div :class="$style.container" ref="container" v-bind="$attrs">
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
    }
</style>