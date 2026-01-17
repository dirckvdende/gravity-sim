<script lang="ts" setup>
    import { mdiClose } from '@mdi/js';
    import SVGIcon from './SVGIcon.vue';

    const emit = defineEmits<{
        /**
         * The popup close button or background is pressed, meaning the popup
         * should be closed
         */
        (e: "close"): void
    }>()
</script>

<template>
    <Teleport to="body">
        <div :class="$style.container">
            <div :class="$style.background" @click="emit('close')" />
            <div :class="$style.popup">
                <div :class="$style.head">
                    <div :class="$style.spacer" />
                    <h1><slot name="head">Warning</slot></h1>
                    <button :class="$style.close" @click="emit('close')">
                        <SVGIcon :path="mdiClose" />
                    </button>
                </div>
                <div :class="$style.body">
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style lang="scss" module>
    .container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        min-height: 100vh;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 1.5em;

        .popup {
            background-color: var(--popup-background-color);
            color: var(--popup-text-color);
            width: 25em;
            max-width: 100%;
            box-sizing: border-box;
            border-radius: .5em;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            
            .head {
                display: flex;
                width: 100%;
                background-color: var(--popup-head-color);
                color: var(--popup-head-text-color);
                justify-content: space-between;
                padding: .5em .8em;
                box-sizing: border-box;
                align-items: center;
                user-select: none;
                
                .spacer, .close {
                    width: 1.1em;
                    height: 1.1em;
                    flex-shrink: 0;
                    box-sizing: border-box;
                }
                
                h1 {
                    font-size: 1.1em;
                    display: block;
                    margin: 0;
                }
                
                .close {
                    fill: var(--popup-head-text-color);
                    background-color: transparent;
                    border: none;
                    color: inherit;
                    display: block;
                    padding: 0;
                    font-size: 1em;
                    cursor: pointer;

                    &:hover {
                        opacity: .8;
                    }
                }
            }
            
            .body {
                padding: 1em 1.5em;
                font-size: .9em;
            }
        }
        
        .background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #0005;
            z-index: -1;
        }
    }
</style>