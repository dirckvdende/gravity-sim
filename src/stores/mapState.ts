
import Vector2 from "@/util/Vector2";
import { defineStore } from "pinia";
import { ref } from "vue";
import { serializer } from "./serializer";

/** State of the map with position and zoom level, tracked globally */
export const useMapStateStore = defineStore("map-state", () => {
    return {
        position: ref(Vector2.Zero),
        zoomLevel: ref(0),
    }
}, {
    persist: { serializer },
})