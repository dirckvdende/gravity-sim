
import { defineStore } from "pinia";
import { ref } from "vue";
import emptyIcon from "@/assets/icons/empty.svg"

/** Store for properties of the loaded scenario */
export const usePropertiesStore = defineStore("properties", () => ({
    /** Scenario icon URL */
    icon: ref(emptyIcon),
    /** Name of the scenario */
    name: ref("Gravity sim scenario"),
    /** Scenario description */
    description: ref(""),
}))