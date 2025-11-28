
import { usePreferredDark } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

/**
 * Store with global options for the simulator
 */
export const useOptionsStore = defineStore("sim-options", () => {
    
    const darkMode = ref(usePreferredDark())

    watch(darkMode, (value) =>
        document.body.classList.toggle("dark-mode", value),
        { immediate: true })

    return {
        /** Whether to show the barycenter as an icon on the map */
        showBarycenter: ref(false),
        /** Whether to show orbits of all bodies */
        showOrbits: ref(true),
        /** Whether to show grid lines */
        showGrid: ref(true),
        /** Dark mode vs light mode theme */
        darkMode,
    }
})