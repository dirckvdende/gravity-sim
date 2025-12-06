<script setup lang="ts">
    import UIContainer from './UIContainer.vue';
    import BottomSettings from './BottomSettings.vue';
    import DarkMode from './DarkMode.vue';
    import TimeDisplay from './TimeDisplay.vue';
    import LoadMenu from './LoadMenu.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import DemoOverlay from './DemoOverlay.vue';

    const { activeMenu } = storeToRefs(useMenuStore())
</script>

<template>
    <UIContainer>
        <BottomSettings />
        <TimeDisplay />
        <LoadMenu :visible="activeMenu == 'load'" />
    </UIContainer>
    <DarkMode />
    <DemoOverlay />
</template>