
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Store with global options for the simulator
 */
export const useOptionsStore = defineStore("sim-options", () => {
    const speed = ref(1)
    const showBarycenter = ref(false)
    return { speed, showBarycenter }
})