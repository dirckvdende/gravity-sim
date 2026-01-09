<script setup lang="ts">
    import SVGIcon from '@/components/SVGIcon.vue';

    const { pathIcon, icon } = defineProps<{
        /** SVG path of the icon of the button */
        pathIcon?: string,
        /** Icon of the button as a url */
        icon?: string,
    }>()

    const emit = defineEmits<{
        /** Emitted when the button is clicked */
        (e: "click", event: PointerEvent): void,
    }>()
</script>

<template>
    <button :class="$style.button" @click="(event) => emit('click', event)">
        <SVGIcon
            v-if="pathIcon"
            :path="pathIcon"
            :class="$style['path-icon']" />
        <div v-else-if="icon" :class="$style.icon">
            <img :src="icon" />
        </div>
        <div :class="$style.text">
            <slot />
        </div>
    </button>
</template>

<style lang="scss" module>
    $icon-size: 1.3em;

    .button {
        width: 100%;
        font-size: 1em;
        display: flex;
        height: 2.2em;
        align-items: center;
        box-sizing: border-box;
        margin: .2em 0;
        border: none;
        background-color: var(--side-menu-button-color);
        border-radius: .5em;
        padding: 0 1em;
        cursor: pointer;

        &:hover {
            background-color: color-mix(in srgb,
                var(--side-menu-button-color), black 5%);
        }

        .path-icon {
            height: $icon-size;
            width: $icon-size;
            fill: var(--side-menu-icon-color);
        }

        .icon {
            height: $icon-size;
            width: $icon-size;
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

        .text {
            margin-left: 1em;
            font-size: .8em;
        }
    }
</style>