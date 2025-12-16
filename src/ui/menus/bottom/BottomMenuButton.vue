<script setup lang="ts">
    import SVGIcon from '@/ui/SVGIcon.vue';

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
    @use "@/colors.scss";

    .button {
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

        .path-icon {
            width: 2em;
            height: 2em;
            fill: var(--icon-color);
        }

        .icon {
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

        .text {
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
            .path-icon {
                fill: color-mix(in srgb, var(--icon-color),
                    var(--bottom-menu-icon-color-mix, black) 20%);
            }

            @media (pointer: fine) {
                .text {
                    display: block;
                }
            }
        }
    }
</style>