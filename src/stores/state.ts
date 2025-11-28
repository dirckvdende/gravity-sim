
import Vector2 from "@/util/Vector2";
import { defineStore } from "pinia";
import { ref } from "vue";

/** State of the simulator, tracked globally */
export const useSimStateStore = defineStore("sim-state", () => {
    return {
        position: ref(Vector2.Zero),
    }
})