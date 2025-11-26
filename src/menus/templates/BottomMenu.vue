<template>
    <div :class="$style.menu">
        <slot />
    </div>
</template>

<style lang="scss" module>
    .menu {
        position: fixed;
        bottom: .6em;
        left: .6em;
        display: flex;
        
        & > :global(.menu-section) {
            display: flex;
            align-items: center;
            padding: 0 .4em;
            background-color: white;
            border-radius: .5em;
            box-shadow: 0 .15em .6em -.35em black;
            user-select: none;

            &:not(:last-child) { margin-right: .5em; }

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
                    pointer-events: none;
                    background-color: white;
                    box-shadow: 0 .15em .6em -.35em black;
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