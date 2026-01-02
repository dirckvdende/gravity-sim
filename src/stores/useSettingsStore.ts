
import { defineStore } from "pinia";
import { ref } from "vue";

/** Store with global settings */
export const useSettingsStore = defineStore("settings", () => ({
    /** Simulation speed */
    speed: ref(1),
    /** Whether the simulation is paused */
    paused: ref(false),
    /** Whether dark mode is enabled */
    darkMode: ref(false),
    /** Whether a grid should be displayed */
    showGrid: ref(true),
    /** Whether orbits should be displayed */
    showOrbits: ref(true),
    /** Whether to show velocity direction/magnitude arrows of objects */
    showVelocityArrows: ref(false),
    /** Whether to show acceleration direction/magnitude arrows of objects */
    showAccelerationArrows: ref(false),
    /** Whether an icon should be displayed at the barycenter of the system */
    showBarycenter: ref(false),
}))