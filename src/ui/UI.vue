<script setup lang="ts">
    import BottomSettings from './menus/BottomSettings.vue';
    import TimeDisplay from './TimeDisplay.vue';
    import LoadMenu from './menus/LoadMenu.vue';
    import ObjectDetailsMenu from './menus/ObjectDetailsMenu.vue';
    import DemoOverlay from './DemoOverlay.vue';
    import ObjectEditMenu from './menus/ObjectEditMenu.vue';
    import { useDarkMode } from '@/composables/useDarkMode';

    useDarkMode()
</script>

<template>
    <div :class="$style.container">
        <div>
            <TimeDisplay />
            <LoadMenu />
            <ObjectDetailsMenu />
            <ObjectEditMenu />
            <BottomSettings />
        </div>
    </div>
    <DemoOverlay />
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