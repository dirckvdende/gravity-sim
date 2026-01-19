<script setup lang="ts">
    import AppMap from '@/components/AppMap.vue';
    import AppUI from '@/components/AppUI.vue';
    import { useExitWarning } from '@/composables/useExitWarning';
    import { loadFromString } from '@/util/filesystem/save.mjs';
    import { setState } from '@/util/filesystem/state.mjs';
    import solarSystemScenario from "@/assets/scenarios/solar-system.grav?raw"

    loadFromString(solarSystemScenario).then((state) => setState(state))

    if (import.meta.env.VITE_EXIT_WARNING !== "false")
        useExitWarning()
</script>

<template>
    <AppMap />
    <AppUI />
</template>

<style lang="scss" module>
    body {
        font-family: "Nunito", sans-serif;
        font-size: 18px;
        font-weight: 500;
        background-color: var(--background-color, white);
    }

    button {
        font-family: inherit;
        font-weight: inherit;
        color: inherit;
    }

    * {
        -webkit-tap-highlight-color: transparent;
    }
</style>

<style lang="scss">
    @use "@/assets/scss/colors.scss";
</style>