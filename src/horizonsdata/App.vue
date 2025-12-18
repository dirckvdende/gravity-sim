<script lang="ts" setup>
    import FileListing from './FileListing.vue';
    import { ref } from 'vue';
    import { deserializeObjectFile, type ObjectFile } from './object';
    import UploadField from './UploadField.vue';
    import { LENGTH_UNITS, MASS_UNITS, unitToHTML, VELOCITY_UNITS } from '@/util/units';

    // List of objects that have been uploaded
    const objects = ref<ObjectFile[]>([])

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
                ]" />
            <UploadField @upload="(text, filename) =>
                addObject(text, filename)" />
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