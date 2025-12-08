
import { defineStore, storeToRefs } from "pinia"
import { useSettingsStore } from "./useSettingsStore"
import { ref } from "vue"
import { type StyledGravityObject } from "@/sim/object"
import { useTimedGravitySim } from "@/sim/useTimedGravitySim"
import { serializer } from "@/serializer"

/** Store running the gravity sim and storing tracked objects */
export const useGravitySimStore = defineStore("sim", () => {
    const objects = ref<StyledGravityObject[]>([])
    const { paused, speed } = storeToRefs(useSettingsStore())
    const sim = useTimedGravitySim(objects, { paused, speed })
    return { ...sim, objects }
}, {
    saveToFiles: {
        files: ["state"],
        serializer,
    }
})