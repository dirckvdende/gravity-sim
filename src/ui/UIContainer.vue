<template>
    <div :class="$style.container">
        <div>
            <slot />
        </div>
    </div>
</template>

<style lang="scss" module>
    .container {
        position: fixed;
        top: calc(.6em + env(safe-area-inset-top, 0px));
        left: calc(.6em + env(safe-area-inset-left, 0px));
        right: calc(.6em + env(safe-area-inset-right, 0px));
        bottom: calc(.6em + env(safe-area-inset-bottom, 0px));
        pointer-events: none;

        & > div {
            width: 0;
            height: 0;
            pointer-events: all;
        }
    }
</style>