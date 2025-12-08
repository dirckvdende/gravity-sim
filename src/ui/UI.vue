<script setup lang="ts">
    import UIContainer from './UIContainer.vue';
    import BottomSettings from './BottomSettings.vue';
    import DarkMode from './DarkMode.vue';
    import TimeDisplay from './TimeDisplay.vue';
    import LoadMenu from './LoadMenu.vue';
    import ObjectDetailsMenu from './ObjectDetailsMenu.vue';
    import DemoOverlay from './DemoOverlay.vue';
</script>

<template>
    <UIContainer>
        <BottomSettings />
        <TimeDisplay />
        <LoadMenu />
        <ObjectDetailsMenu />
    </UIContainer>
    <DarkMode />
    <DemoOverlay />
</template>