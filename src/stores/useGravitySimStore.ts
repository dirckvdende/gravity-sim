
import { defineStore, storeToRefs } from "pinia"
import { useSettingsStore } from "./useSettingsStore"
import { ref, computed } from "vue"
import { type StyledGravityObject } from "@/util/sim/object"
import { useTimedGravitySim } from "@/composables/useTimedGravitySim"
import { useMenuStore } from "./useMenuStore"
import { useWindowFocus } from "@vueuse/core"

/** Store running the gravity sim and storing tracked objects */
export const useGravitySimStore = defineStore("sim", () => {
    const objects = ref<StyledGravityObject[]>([])
    const { activeMenu } = storeToRefs(useMenuStore())
    const { paused: pausedByUser, speed } = storeToRefs(useSettingsStore())
    const windowFocus = useWindowFocus()
    const paused = computed(() =>
        pausedByUser.value
        || activeMenu.value == "object-edit"
        || !windowFocus.value)
    const sim = useTimedGravitySim(objects, { paused, speed })
    return { ...sim, objects }
})