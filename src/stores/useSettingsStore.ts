
import { defineStore } from "pinia";
import { ref } from "vue";

/** Store with global settings */
export const useSettingsStore = defineStore("settings", () => ({
    /** Simulation speed */
    speed: ref(1),
    /** Whether the simulation is paused */
    paused: ref(false),
}))