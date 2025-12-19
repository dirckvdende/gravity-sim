<script lang="ts" setup>
    import FileListing from './FileListing.vue';
    import { ref, watch } from 'vue';
    import { deserializeObjectFile, type ObjectFile } from './object';
    import UploadField from './UploadField.vue';
    import { LENGTH_UNITS, MASS_UNITS, unitToHTML, VELOCITY_UNITS } from
    '@/util/units';
    import type { StateFile } from '@/filesystem/statefile.mjs';
    import { convertToStateFile } from './convert';
    import { saveToFile } from '@/filesystem/save.mjs';

    // List of objects that have been uploaded
    const objects = ref<ObjectFile[]>([])
    // State file to download. Should be null if it hasn't been generated for
    // current settings
    const stateDownload = ref<StateFile | null>(null)
    const isLoading = ref(false)

    watch(objects.value, () => {
        stateDownload.value = null
        for (const object of objects.value)
            object.generatorData = undefined
    }, { deep: false })

    /**
     * Remove the given object file from the list
     * @param objectFile The object file to remove
     */
    function removeObject(objectFile: ObjectFile): void {
        objects.value = objects.value.filter((value) => value != objectFile)
    }

    /**
     * Add an object from Horizons data text file
     * @param text The contents of the file
     * @param filename The filename
     */
    function addObject(text: string, filename: string): void {
        const splitPath = filename.split(/\/|\\/gi)
        const objectFile = deserializeObjectFile(text,
            splitPath[splitPath.length - 1])
        objects.value.push(objectFile)
    }

    /**
     * Generate state file from the list of objects and put it in the
     * stateDownload ref
     */
    function generate(): void {
        isLoading.value = true;
        (async () => {
            stateDownload.value = convertToStateFile(objects.value)
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
                The tool flattens flattens the imported 3D coordinates to a 2D
                plane. As such some accuracy is lost when not all points are on
                the same plane. Make sure to upload at least three
                <i>different</i> files for this to work properly.
            </p>
            <FileListing
                v-for="objectFile in objects"
                :filename="objectFile.filename"
                :name="objectFile.name"
                @delete="() => removeObject(objectFile)"
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
                    `error: ${objectFile.generatorData?.error}`,
                ]" />
            <UploadField @upload="(text, filename) =>
                addObject(text, filename)" />
            <div :class="$style['bottom-buttons']">
                <button v-if="objects.length >= 3"
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