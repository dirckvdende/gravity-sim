
import Vector2 from "@/util/Vector2";
import { defineStore } from "pinia";
import { ref } from "vue";
import { serializer } from "@/serializer";

/** Store with current gravity map state. Syncing happens in GravityMap.vue */
export const useGravityMapStore = defineStore("gravity-map", () => ({
    position: ref(Vector2.Zero),
    zoomLevel: ref(0),
}), {
    persist: { serializer },
    saveToFiles: {
        files: ["state"],
        serializer,
    }
})