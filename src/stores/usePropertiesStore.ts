
import { defineStore } from "pinia";
import { ref } from "vue";

/** Store for properties of the loaded scenario */
export const usePropertiesStore = defineStore("properties", () => ({
    /** Scenario icon URL */
    icon: ref("./icons/empty.svg"),
    /** Name of the scenario */
    name: ref("Gravity sim scenario"),
}))