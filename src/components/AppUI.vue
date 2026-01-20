<script setup lang="ts">
    import AppMenuBottom from '@/components/AppMenuBottom.vue';
    import AppTimeDisplay from '@/components/AppTimeDisplay.vue';
    import AppMenuLoad from '@/components/AppMenuLoad.vue';
    import AppMenuObjectDetails from '@/components/AppMenuObjectDetails.vue';
    import AppDemoOverlay from '@/components/AppDemoOverlay.vue';
    import AppMenuObjectEdit from '@/components/AppMenuObjectEdit.vue';
    import { useDarkMode } from '@/composables/useDarkMode';
    import AppMenuScenarioDetails from './AppMenuScenarioDetails.vue';
    import AppMenuScenarioEdit from './AppMenuScenarioEdit.vue';
    import AppIntroPupup from './AppIntroPupup.vue';

    useDarkMode()
</script>

<template>
    <div :class="$style.container">
        <div>
            <AppTimeDisplay />
            <AppMenuLoad />
            <AppMenuObjectDetails />
            <AppMenuObjectEdit />
            <AppMenuScenarioDetails />
            <AppMenuScenarioEdit />
            <AppMenuBottom />
        </div>
    </div>
    <AppDemoOverlay />
    <AppIntroPupup />
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