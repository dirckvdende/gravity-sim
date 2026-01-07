<script lang="ts" setup generic="TFile extends UnwrapRef<any>">
    import { ref, watch, type Ref, type UnwrapRef } from "vue";
    import FileListItem from "./FileListItem.vue";

    const {
        deleteButtons = true,
    } = defineProps<{
        /** Whether to show delete buttons next to list items */
        deleteButtons?: boolean
    }>()

    const emit = defineEmits<{
        /** Emitted when the list of items is updated */
        (e: "update"): void
    }>()

    /** Items in the list */
    const items = ref<TFile[]>([]) as Ref<TFile[]>
    // Update is only emitted if the actual list is updated, not if object
    // properties are changed
    watch(items, () => emit("update"), { deep: 1 })

    const slots = defineSlots<{
        /** Filename of an item */
        filename?: (props: { item: TFile }) => any
        /**
         * Display name to show instead of the filename. If this is present, the
         * filename will be displayed greyed out next to the display name
         */
        displayName?: (props: { item: TFile }) => any
        /** Text below the filename */
        annotation?: (props: { item: TFile }) => any
    }>()

    /**
     * Check if an item is a file object
     * @param item The item to check
     * @returns Whether the item is a file object
     */
    function itemIsFile(item: TFile): boolean {
        return item instanceof File
    }

    defineExpose({ items })
</script>

<template>
    <FileListItem
        v-for="item in items"
        @delete="items = items.filter(x => x != item)"
        :delete-button="deleteButtons">
        <template #filename>
            <slot name="filename" :item="(item as TFile)">
                {{ itemIsFile(item as TFile) ? (item as File).name : item }}
            </slot>
        </template>
        <template #displayName v-if="slots.displayName">
            <slot name="displayName" :item="(item as TFile)" />
        </template>
        <template #annotation v-if="slots.annotation">
            <slot name="annotation" :item="(item as TFile)" />
        </template>
    </FileListItem>
</template>

<style lang="scss" module></style>