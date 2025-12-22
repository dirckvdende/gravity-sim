<script lang="ts" setup>
    import type { ObjectFile } from '../object';
    import { unitToHTML, MASS_UNITS, LENGTH_UNITS, VELOCITY_UNITS } from
    '@/util/units';
    import FileListing from './FileListing.vue';
    import { computed } from 'vue';

    const { objectFile } = defineProps<{
        /** The object file to list */
        objectFile: ObjectFile
    }>()

    const emit = defineEmits<{
        /** Emitted when the user clicks the delete button */
        (e: "delete"): void
    }>()

    const stats = computed(() => ({
        mass: unitToHTML(objectFile.mass, MASS_UNITS),
        size: unitToHTML(objectFile.size, LENGTH_UNITS),
        x: unitToHTML(objectFile.position.x, LENGTH_UNITS),
        y: unitToHTML(objectFile.position.y, LENGTH_UNITS),
        z: unitToHTML(objectFile.position.z, LENGTH_UNITS),
        vx: unitToHTML(objectFile.velocity.x, VELOCITY_UNITS),
        vy: unitToHTML(objectFile.velocity.y, VELOCITY_UNITS),
        vz: unitToHTML(objectFile.velocity.z, VELOCITY_UNITS),
        time: objectFile.time.toUTCString(),
    }))
</script>

<template>
    <FileListing
        :filename="objectFile.filename"
        :name="objectFile.name"
        @delete="() => emit('delete')">
        <template #subtext>
            <template v-for="(content, name, index) in stats">
                <template v-if="index != 0">&ensp;&bullet;&ensp;</template>
                <span>{{ name }}:</span>&nbsp;<span v-html="content" />
            </template>
        </template>
        <template #subtext-warn v-if="objectFile.generatorData">
            position error:&nbsp;<span v-html="unitToHTML(
                objectFile.generatorData.positionError,
                LENGTH_UNITS,
                { significance: 1 },
            )" />&nbsp;(<span v-html="unitToHTML(
                objectFile.generatorData.positionErrorRelative * 100,
                [{ suffix: '%', scale: 1 }],
                { significance: 1 },
            )" />), velocity error:&nbsp;<span v-html="unitToHTML(
                objectFile.generatorData.velocityError,
                VELOCITY_UNITS,
                { significance: 1 },
            )" />&nbsp;(<span v-html="unitToHTML(
                objectFile.generatorData.velocityErrorRelative * 100,
                [{ suffix: '%', scale: 1 }],
                { significance: 1 },
            )" />)
        </template>
    </FileListing>
</template>