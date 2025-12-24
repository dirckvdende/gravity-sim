
import { defineStore, storeToRefs } from "pinia"
import { useSettingsStore } from "./useSettingsStore"
import { ref, computed } from "vue"
import { type StyledGravityObject } from "@/sim/object"
import { useTimedGravitySim } from "@/sim/useTimedGravitySim"
import { useMenuStore } from "./useMenuStore"

/** Store running the gravity sim and storing tracked objects */
export const useGravitySimStore = defineStore("sim", () => {
    const objects = ref<StyledGravityObject[]>([])
    const { activeMenu } = storeToRefs(useMenuStore())
    const { paused: pausedByUser, speed } = storeToRefs(useSettingsStore())
    const paused = computed(() =>
        pausedByUser.value || activeMenu.value == "object-edit")
    const sim = useTimedGravitySim(objects, { paused, speed })
    return { ...sim, objects }
})