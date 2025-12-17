<script lang="ts" setup>
    import FileListing from './FileListing.vue';
    import { ref } from 'vue';
    import { deserializeObjectFile, type ObjectFile } from './object';
    import UploadField from './UploadField.vue';

    // List of objects that have been uploaded
    const objects = ref<ObjectFile[]>([])

    /** Remove the given object file from the list */
    function removeObject(objectFile: ObjectFile): void {
        objects.value = objects.value.filter((value) => value != objectFile)
    }

    /** Add an object from Horizons data text file */
    function addObject(text: string): void {
        const objectFile = deserializeObjectFile(text)
        objects.value.push(objectFile)
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
            <FileListing
                v-for="objectFile in objects"
                :filename="objectFile.filename"
                :name="objectFile.name"
                @delete="() => removeObject(objectFile)" />
            <UploadField @upload="(text) => addObject(text)" />
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
</style>

<style lang="scss">
    @use "@/colors.scss";
</style>