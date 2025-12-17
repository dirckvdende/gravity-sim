<script lang="ts" setup>
    import SVGIcon from '@/ui/SVGIcon.vue';
import { uploadString } from '@/util/uploadString';
    import { mdiUpload } from '@mdi/js';

    const emit = defineEmits<{
        /**
         * Emitted when a file is uploaded, with as parameter the content of the
         * file as a string
         */
        (e: "upload", content: string): void
    }>()

    /** Prompt the user to upload a file */
    function uploadPrompt(): void {
        uploadString(".txt").then((value) => emit("upload", value))
    }
</script>

<template>
    <button :class="$style.container" @click="uploadPrompt">
        <div :class="$style.icon">
            <SVGIcon :path="mdiUpload" :class="$style.svg" />
        </div>
    </button>
</template>

<style lang="scss" module>
    .container {
        width: 100%;
        box-sizing: border-box;
        padding: .5em 1.5em;
        border: .15em dashed #ccc;
        border-radius: .5em;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4em;
        background-color: transparent;
        cursor: pointer;

        .icon {
            height: 100%;
            aspect-ratio: 1 / 1;
            display: flex;

            .svg {
                height: 100%;
                fill: #aaa;
            }
        }

        &:hover {
            border-color: #888;

            .svg {
                fill: #777;
            }
        }
    }
</style>