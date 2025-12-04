<script setup lang="ts">
    import UIContainer from './UIContainer.vue';
    import BottomSettings from './BottomSettings.vue';
    import DarkMode from './DarkMode.vue';
    import TimeDisplay from './TimeDisplay.vue';
</script>

<template>
    <UIContainer>
        <BottomSettings />
        <TimeDisplay />
    </UIContainer>
    <DarkMode />
</template>