
import { useTimedGravitySim } from "@/sim/useTimedGravitySim";
import { defineStore, storeToRefs } from "pinia";
import { useSettingsStore } from "./useSettingsStore";
import { serializer } from "@/serializer";

/** Timed gravity sim store */
export const useGravitySimStore = defineStore("sim", () => {
    const { paused, speed } = storeToRefs(useSettingsStore())
    const sim = useTimedGravitySim({ paused, speed })
    return { ...sim }
}, {
    saveToFiles: {
        files: ["state"],
        serializer,
    }
})