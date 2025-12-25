
import { defineStore } from "pinia";
import { ref } from "vue";

/** Store that handles clearing orbits */
export const useOrbitsStore = defineStore("orbits", () => {
    const clearCallbacks = ref<(() => void)[]>([])

    function clear() {
        for (const callback of clearCallbacks.value)
            callback()
    }

    return { clearCallbacks, clear }
})