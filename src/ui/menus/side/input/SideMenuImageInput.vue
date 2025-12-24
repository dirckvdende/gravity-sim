<script setup lang="ts">
    import { useDropZone, useFileDialog } from '@vueuse/core';
    import { useTemplateRef } from 'vue';

    const model = defineModel<string>({ default: "./icons/empty.svg" })

    /**
     * Process list of uploaded files (should only have one file) and update
     * displayed image
     * @param files The files to process
     */
    function uploadFiles(files: File[] | FileList | null): void {
        if (files == null)
            return
        for (const file of files)
            model.value = URL.createObjectURL(file)
    }

    // File dialog when image is clicked
    const { open, onChange } = useFileDialog({
        multiple: false,
        accept: "image/*",
        reset: true,
    })
    onChange(uploadFiles)

    // Drag and drop image
    const { isOverDropZone } = useDropZone(useTemplateRef("wrapper"), {
        dataTypes: (types: readonly string[]) => {
            for (const type of types)
                if (!type.startsWith("image/"))
                    return false
            return true
        },
        multiple: false,
        preventDefaultForUnhandled: true,
        onDrop: uploadFiles,
    })
</script>

<template>
    <div :class="$style.container">
        <div ref="wrapper">
            <button :class="[$style.frame, {
                [$style.active]: isOverDropZone,
            }]" @click="() => open()">
                <img :src="model" />
            </button>
        </div>
    </div>
</template>

<style lang="scss" module>
    .container {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        padding: 0 3em;
        margin: .5em 0;
        justify-content: center;

        .frame {
            max-width: 100%;
            width: 7em;
            aspect-ratio: 1 / 1;
            padding: .5em;
            border-radius: .3em;
            border: .12em dashed var(--side-menu-input-border-color);
            display: flex;
            cursor: pointer;
            background-color: transparent;
            font-size: 1em;

            &:hover, &.active {
                border-color: var(--side-menu-input-border-color-focus);
            }

            & > img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
</style>