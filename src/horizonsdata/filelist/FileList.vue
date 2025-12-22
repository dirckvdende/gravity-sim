<script lang="ts" setup>
    import { ref } from 'vue';
    import { type ObjectFile } from '../object';
    import ObjectFileListing from './ObjectFileListing.vue';
    import { deserializeObjectFile } from '../deserialize';
    import UploadField from './UploadField.vue';
    import { DeserializationError } from '../deserialize/error';

    // List of uploaded files
    const files = ref<ObjectFile[]>([])

    defineExpose({
        /** List of uploaded files */
        files,
    })

    const emit = defineEmits<{
        /** Emitted when an item is added or removed */
        (e: "update"): void
        /**
         * Emitted when an item is attempted to be added, but an error
         * occurred. Called with the error message and filenmae
         */
        (e: "error", message: string, filename: string): void
    }>()

    /**
     * Remove the given object file from the list
     * @param objectFile The object file to remove
     */
    function remove(objectFile: ObjectFile): void {
        files.value = files.value.filter((value) => value != objectFile)
        emit("update")
    }

    /**
     * Add an object from Horizons data text file
     * @param text The contents of the file
     * @param filename The filename
     */
    function add(text: string, filename: string): void {
        const splitPath = filename.split(/\/|\\/gi)
        try {
            const objectFile = deserializeObjectFile(text,
                splitPath[splitPath.length - 1])
            files.value.push(objectFile)
        } catch (error) {
            if (error instanceof DeserializationError)
                emit("error", error.message, filename)
            return
        }
        emit("update")
    }
</script>

<template>
    <ObjectFileListing
        v-for="objectFile in files"
        :object-file="objectFile"
        @delete="() => remove(objectFile)" />
    <UploadField @upload="(text, filename) =>
        add(text, filename)" />
</template>