<script setup lang="ts">
    import UIContainer from './UIContainer.vue';
    import BottomSettings from './menus/BottomSettings.vue';
    import DarkMode from './DarkMode.vue';
    import TimeDisplay from './TimeDisplay.vue';
    import LoadMenu from './menus/LoadMenu.vue';
    import ObjectDetailsMenu from './menus/ObjectDetailsMenu.vue';
    import DemoOverlay from './DemoOverlay.vue';
</script>

<template>
    <UIContainer>
        <TimeDisplay />
        <LoadMenu />
        <ObjectDetailsMenu />
        <BottomSettings />
    </UIContainer>
    <DarkMode />
    <DemoOverlay />
</template>