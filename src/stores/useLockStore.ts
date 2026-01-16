
import type { StyledGravityObject } from "@/util/sim/object";
import { defineStore } from "pinia";
import { ref } from "vue";

/** Store for which object is locked onto */
export const useLockStore = defineStore("lock", () => ({
    /** Object currently locked onto */
    lockedObject: ref<StyledGravityObject | null>(null)
}))