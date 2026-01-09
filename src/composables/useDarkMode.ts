
import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { watch } from "vue"

/** Adds a dark-mode CSS class to the document body when dark mode is enabled */
export function useDarkMode(): void {
    const { darkMode } = storeToRefs(useSettingsStore())
    watch(darkMode, (value) =>
        document.body.classList.toggle("dark-mode", value),
        { immediate: true },
    )
}