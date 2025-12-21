<script lang="ts" setup>
    import SVGIcon from '@/ui/SVGIcon.vue';
    import { mdiUpload } from '@mdi/js';
    import { useDropZone, useFileDialog } from '@vueuse/core';
    import { useTemplateRef } from 'vue';

    const emit = defineEmits<{
        /**
         * Emitted when a file is uploaded, with as parameters the content of
         * the file as a string and the filename
         */
        (e: "upload", content: string, filename: string): void
    }>()

    function uploadFiles(files: File[] | FileList | null): void {
        if (files == null)
            return
        for (const file of files)
            file.text().then((content) => emit("upload", content, file.name))
    }

    const {
        open: openFileDialog,
        onChange: onFileDialogChange,
    } = useFileDialog({
        multiple: true,
        accept: "text/plain",
        reset: true,
    })
    onFileDialogChange(uploadFiles)

    const { isOverDropZone } = useDropZone(useTemplateRef("uploadField"), {
        dataTypes: ["text/plain"],
        multiple: true,
        preventDefaultForUnhandled: true,
        onDrop: uploadFiles,
    })
</script>

<template>
    <div ref="uploadField">
        <button :class="[$style.container, {
            [$style.hovered]: isOverDropZone,
        }]" @click="() => openFileDialog()">
            <div :class="$style.icon">
                <SVGIcon :path="mdiUpload" :class="$style.svg" />
            </div>
        </button>
    </div>
</template>

<style lang="scss" module>
    .container {
        width: 100%;
        box-sizing: border-box;
        padding: 1.5em 1.5em;
        border: .15em dashed #ccc;
        border-radius: .5em;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 6em;
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

        &:hover, &.hovered {
            border-color: #888;

            .svg {
                fill: #777;
            }
        }
    }
</style>