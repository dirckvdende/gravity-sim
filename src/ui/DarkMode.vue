<script setup lang="ts">
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { storeToRefs } from 'pinia';
    import { watch } from 'vue';

    const { darkMode } = storeToRefs(useSettingsStore())
    watch(darkMode, (value) =>
        document.body.classList.toggle("dark-mode", value))
</script>

<template></template>