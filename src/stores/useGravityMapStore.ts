
import Vector2 from "@/util/Vector2";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGravityMapStore = defineStore("gravity-map", () => ({
    position: ref(Vector2.Zero),
}))