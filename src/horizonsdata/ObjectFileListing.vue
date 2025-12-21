<script lang="ts" setup>
    import type { ObjectFile } from './object';
    import { unitToHTML, MASS_UNITS, LENGTH_UNITS, VELOCITY_UNITS } from
    '@/util/units';
    import FileListing from './FileListing.vue';

    const { objectFile } = defineProps<{
        /** The object file to list */
        objectFile: ObjectFile
    }>()

    const emit = defineEmits<{
        /** Emitted when the user clicks the delete button */
        (e: "delete"): void
    }>()
</script>

<template>
    <FileListing
        :filename="objectFile.filename"
        :name="objectFile.name"
        @delete="() => emit('delete')"
        :stats="[
            `mass: ${unitToHTML(objectFile.mass, MASS_UNITS)}`,
            `size: ${unitToHTML(objectFile.size, LENGTH_UNITS)}`,
            `x: ${unitToHTML(objectFile.position.x, LENGTH_UNITS)}`,
            `y: ${unitToHTML(objectFile.position.y, LENGTH_UNITS)}`,
            `z: ${unitToHTML(objectFile.position.z, LENGTH_UNITS)}`,
            `vx: ${unitToHTML(objectFile.velocity.x, VELOCITY_UNITS)}`,
            `vy: ${unitToHTML(objectFile.velocity.y, VELOCITY_UNITS)}`,
            `vz: ${unitToHTML(objectFile.velocity.z, VELOCITY_UNITS)}`,
            `time: ${objectFile.time.toUTCString()}`,
            `error: ${objectFile.generatorData == undefined ? '-' :
            unitToHTML(objectFile.generatorData.error, LENGTH_UNITS)}`,
        ]" />
</template>