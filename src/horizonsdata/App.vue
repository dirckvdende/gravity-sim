<script lang="ts" setup>
    import FileListing from './FileListing.vue';
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
            <FileListing filename="test.txt" name="test" />
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