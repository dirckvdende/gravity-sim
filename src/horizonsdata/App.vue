<script lang="ts" setup>
    import { ref, useTemplateRef } from 'vue';
    import type { StateFile } from '@/filesystem/statefile.mjs';
    import { convertToStateFile } from './convert';
    import { saveToFile } from '@/filesystem/save.mjs';
    import FileList from './filelist/FileList.vue';

    // List of objects that have been uploaded
    const fileList = useTemplateRef("file-list")
    // State file to download. Should be null if it hasn't been generated for
    // current settings
    const stateDownload = ref<StateFile | null>(null)
    const isLoading = ref(false)

    /** Reset current state file download and generator data */
    function resetGeneratorData(): void {
        stateDownload.value = null
        fileList.value?.files?.forEach((objectFile) =>
            objectFile.generatorData = undefined)
    }

    /**
     * Generate state file from the list of objects and put it in the
     * stateDownload ref
     */
    function generate(): void {
        isLoading.value = true;
        (async () => {
            if (fileList.value?.files)
                stateDownload.value = convertToStateFile(fileList.value.files)
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
                The tool flattens the imported 3D coordinates to a 2D plane. As
                such some accuracy is lost when not all points are on the same
                plane. Make sure to upload at least three <i>different</i> files
                for this to work properly.
            </p>
            <FileList ref="file-list" @update="resetGeneratorData" />
            <div :class="$style['bottom-buttons']">
                <button v-if="(fileList?.files?.length ?? 0) >= 1"
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