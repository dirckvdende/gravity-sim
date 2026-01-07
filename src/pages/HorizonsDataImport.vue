<script lang="ts" setup>
    import { ref, useTemplateRef } from 'vue';
    import type { StateFile } from '@/filesystem/statefile.mjs';
    import { convertToStateFile } from '@/horizonsdata/convert';
    import { saveToFile } from '@/filesystem/save.mjs';
    import ErrorMessage from '@/horizonsdata/ErrorMessage.vue';
    import { ConversionError } from '@/horizonsdata/convert/error';
    import FileList from '@/components/FileList.vue';
    import type { ObjectFile } from '@/horizonsdata/object';
    import { unitToHTML, MASS_UNITS, LENGTH_UNITS, VELOCITY_UNITS } from
    '@/util/units';
    import { DeserializationError } from '@/horizonsdata/deserialize/error';
    import { deserializeObjectFile } from '@/horizonsdata/deserialize';
    import UploadField from '@/components/UploadField.vue';

    // List of objects that have been uploaded
    const fileList = useTemplateRef("file-list")
    // State file to download. Should be null if it hasn't been generated for
    // current settings
    const stateDownload = ref<StateFile | null>(null)
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)

    /** Reset current state file download and generator data */
    function resetGeneratorData(): void {
        stateDownload.value = null
        fileList.value?.items?.forEach((objectFile) =>
            objectFile.generatorData = undefined)
    }

    /**
     * Called when an error occurred while updating the file list
     * @param message The error message to display
     * @param filename The file that couldn't be added
     */
    function listError(message: string, filename: string): void {
        errorMessage.value = `Error while loading file "${filename}": `
            + message
    }

    /** Called when the file list is updated */
    function listUpdate(): void {
        resetGeneratorData()
        errorMessage.value = null
    }

    /**
     * Generate state file from the list of objects and put it in the
     * stateDownload ref
     */
    function generate(): void {
        isLoading.value = true;
        (async () => {
            errorMessage.value = null
            if (fileList.value?.items) {
                try {
                    stateDownload.value = convertToStateFile(
                        fileList.value.items)
                } catch (error) {
                    if (error instanceof ConversionError)
                        errorMessage.value = error.message
                }
            }
            isLoading.value = false
        })()
    }

    /**
     * Download the currently stored state file. If this is not available do
     * nothing
     */
    function download(): void {
        if (!stateDownload.value)
            return
        saveToFile(stateDownload.value)
    }

    /**
     * Get a list of stats from an object file
     * @param objectFile Object file to get the stats of
     * @returns An object with stat names and values as HTML
     */
    function stats(objectFile: ObjectFile): Record<string, string> {
        return {
            mass: unitToHTML(objectFile.mass, MASS_UNITS),
            size: unitToHTML(objectFile.size, LENGTH_UNITS),
            x: unitToHTML(objectFile.position.x, LENGTH_UNITS),
            y: unitToHTML(objectFile.position.y, LENGTH_UNITS),
            z: unitToHTML(objectFile.position.z, LENGTH_UNITS),
            vx: unitToHTML(objectFile.velocity.x, VELOCITY_UNITS),
            vy: unitToHTML(objectFile.velocity.y, VELOCITY_UNITS),
            vz: unitToHTML(objectFile.velocity.z, VELOCITY_UNITS),
            time: objectFile.time.toUTCString(),
        }
    }

    /**
     * Get a string representing object file generator data
     * @param objectFile The object file to get generator data from
     * @retruns The generator data string to display, or undefined if there is
     * no generator data
     */
    function generatorData(objectFile: ObjectFile): string | undefined {
        const data = objectFile.generatorData
        if (!data)
            return undefined
        const percentUnits = [{ suffix: '%', scale: 1 }]
        return `position error: ${unitToHTML(data.positionError, LENGTH_UNITS)}
            (${unitToHTML(data.positionErrorRelative * 100, percentUnits)}),
            velocity error: ${unitToHTML(data.velocityError, VELOCITY_UNITS)}
            (${unitToHTML(data.velocityErrorRelative * 100, percentUnits)})`
    }

    /**
     * Add a file to the list, if it can be deserialized. If it cannot be
     * deserialized an error is displayed
     * @param text Text contents of the file
     * @param filename Filename of the file
     */
    function addFile(text: string, filename: string): void {
        const splitPath = filename.split(/\/|\\/gi)
        try {
            const objectFile = deserializeObjectFile(text,
                splitPath[splitPath.length - 1])
            fileList.value?.items.push(objectFile)
        } catch (error) {
            if (error instanceof DeserializationError)
                listError(error.message, filename)
        }
    }
</script>

<template>
    <div :class="$style.container">
        <div>
            <h1>Convert NASA Horizons data</h1>
            <p>
                This is a tool to convert NASA Horizons data files to the format
                used by the gravity sim. NASA Horizons data can be downloaded
                <a href="https://ssd.jpl.nasa.gov/horizons/app.html#/"
                target="_blank">here</a>.
                Make sure you change the ephemeris type to "Vector Table" and
                use the same coordinate center and time specification for all
                files. Leave the table settings on "defaults".
            </p>
            <p>
                The tool flattens the imported 3D coordinates to a 2D plane. As
                such some accuracy is lost when not all points are on the same
                plane. Make sure to upload at least three <i>different</i> files
                for this to work properly.
            </p>
            <!-- @vue-generic {ObjectFile} -->
            <FileList ref="file-list" @update="listUpdate">
                <template #filename="{ item }">{{ item.filename }}</template>
                <template #displayName="{ item }">{{ item.name }}</template>
                <template #annotation="{ item }">
                    <template v-for="(content, name, index) in stats(item)">
                        <template v-if="index != 0">
                            &ensp;&bullet;&ensp;
                        </template>
                        <span>{{ name }}:</span>&nbsp;<span v-html="content" />
                    </template>
                    <template v-if="item.generatorData">
                        <br />
                        <span style="color: var(--accent-color-orange)" 
                            v-html="generatorData(item)" />
                    </template>
                </template>
            </FileList>
            <UploadField @upload="addFile" />
            <ErrorMessage :message="errorMessage" />
            <div :class="$style['bottom-buttons']">
                <button v-if="(fileList?.items?.length ?? 0) >= 1"
                    :class="$style['calculate-button']" @click="generate">
                    {{ isLoading ? "..." : "Generate" }}</button>
                <button v-if="stateDownload" :class="$style['download-button']"
                    @click="download">Download</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
    body {
        font-family: "Nunito", sans-serif;
        font-size: 18px;
        font-weight: 500;
        background-color: var(--background-color, white);
    }

    button {
        font-family: inherit;
        font-weight: inherit;
        color: inherit;
    }

    * {
        -webkit-tap-highlight-color: transparent;
    }

    .container {
        width: 100%;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        padding: 3em 1em;
        
        & > div {
            width: 100%;
            max-width: 600px;
        }
    }

    a {
        color: var(--accent-color-blue);

        &:hover {
            color: color-mix(in srgb, var(--accent-color-blue),
                transparent 30%);
        }

        &:visited {
            color: var(--accent-color-blue);
        }
    }

    .bottom-buttons {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 1.2em;

        & > button {
            margin: 0 .5em;
            border-radius: .2em;
            border: none;
            font-size: 1em;
            padding: .3em .8em;
            color: white;
            cursor: pointer;

            &:hover {
                opacity: .8;
            }
        }

        .calculate-button {
            background-color: var(--accent-color-blue);
        }

        .download-button {
            background-color: var(--accent-color-orange);
        }
    }
</style>

<style lang="scss">
    @use "@/colors.scss";
</style>