import { defineStore } from "pinia";
import { ref } from "vue";

/** Store for which menu is currently being displayed */
export const useMenuStore = defineStore("menu-state", () => {
    const activeMenu = ref<"none" | "load">("none")
    return {
        /** Currently displayed menu */
        activeMenu,
    }
})