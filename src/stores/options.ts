
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Store with global options for the simulator
 */
export const useOptionsStore = defineStore("sim-options", () => {
    const showBarycenter = ref(false)
    return { showBarycenter }
})