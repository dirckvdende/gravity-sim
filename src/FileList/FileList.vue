<script lang="ts" setup generic="TFile">
    import { computed, ref, watch } from "vue";
    import type { FileListItemDisplay } from "./fileListItemDisplay";
    import FileListItem from "./FileListItem.vue";

    const {
        deleteButtons = true,
        display,
    } = defineProps<{
        /** Whether to show delete buttons next to list items */
        deleteButtons?: boolean
        /**
         * Function to apply to items to generate display information
         * @param item The item in the list
         * @returns Display information object
         */
        display?: (item: TFile) => Partial<FileListItemDisplay>
    }>()

    const emit = defineEmits<{
        /** Emitted when the list of items is updated */
        (e: "update"): void
    }>()

    /**
     * Add default display info to custom display() function output
     * @param item The item to get the display info of
     * @returns The full display info of the item
     */
    function defaultDisplay(item: TFile): FileListItemDisplay {
        const defaults: FileListItemDisplay = item instanceof File ? {
            filename: item.name,
            displayName: "",
            annotation: "",
        } : {
            filename: String(item),
            displayName: "",
            annotation: "",
        }
        return {
            ...defaults,
            ...display?.(item),
        }
    }

    /** Items in the list */
    const items = ref<TFile[]>([])
    watch(items, () => emit("update"))
    /** Items with their display information */
    const itemsWithDisplay = computed(() =>
        items.value.map(item => ({ item, ...defaultDisplay(item as TFile) })))

    defineExpose({ items })
</script>

<template>
    <FileListItem
        v-for="item in itemsWithDisplay"
        @delete="items = items.filter(x => x != item)"
        :delete-button="deleteButtons">
        <template #filename>{{ item.filename }}</template>
        <template #displayName v-if="item.displayName">
            {{ item.displayName }}
        </template>
        <template #annotation>{{ item.annotation }}</template>
    </FileListItem>
</template>

<style lang="scss" module>

</style>