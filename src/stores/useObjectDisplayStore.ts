
import { defineStore, storeToRefs } from "pinia";
import { useGravitySimStore } from "./useGravitySimStore";
import { computed, ref } from "vue";
import type { GravityObject } from "@/sim/object";
import { serializer } from "@/serializer";

/** Display information of a gravity object */
export type GravityObjectStyle = {
    /** ID of the gravity object the display info is referencing */
    id: number
    /** Size (diameter) of the object */
    size: number
    /** Object icon URL */
    icon: string
}

/** Gravity object with combined display info */
export type StyledGravityObject = GravityObjectStyle & GravityObject

/** Store processing gravity objects with display information */
export const useObjectDisplayStore = defineStore("objects", () => {
    const { objects } = storeToRefs(useGravitySimStore())
    const objectStyles = ref<GravityObjectStyle[]>([])

    const styledObjects = computed<StyledGravityObject[]>(() => {
        const out: StyledGravityObject[] = []
        for (const object of objects.value) {
            const style = objectStyles.value.find(({ id }) => id == object.id)
            out.push({
                ...object,
                ...(style ?? {
                    size: 0,
                    icon: "./icons/empty.svg",
                })
            })
        }
        return out
    })

    return {
        /** Display info of gravity objects */
        objectStyles,
        /**
         * Combined gravity object and display info. Gravity objects without
         * display info are given with a size of 0 and an empty icon
         */
        styledObjects,
    }
}, {
    saveToFiles: {
        files: ["state"],
        pick: ["objectStyles"],
        serializer,
    }
})