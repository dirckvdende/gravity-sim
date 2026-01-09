
import type { StyledGravityObject } from "@/util/sim/object";
import { defineStore } from "pinia";
import { ref } from "vue";

/** Store for which menu is currently being displayed */
export const useMenuStore = defineStore("menu-state", () => ({
    /** Currently displayed menu */
    activeMenu: ref<
        | "none"
        | "load"
        | "object-details"
        | "object-edit"
    >("none"),
    /**
     * Object of which details are currently shown (if object-details is active)
     */
    focusedObject: ref<StyledGravityObject | null>(null)
}))