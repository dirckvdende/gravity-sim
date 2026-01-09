<script setup lang="ts">
    import { useDropZone, useFileDialog } from '@vueuse/core';
    import { useTemplateRef } from 'vue';
    import emptyIcon from "@/assets/icons/empty.svg"

    const { presets } = defineProps<{
        /**
         * Preset icons that can be selected from a list below the image
         * (default no presets)
         */
        presets?: string[]
    }>()

    const model = defineModel<string>({ default: emptyIcon })

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
    <div :class="$style['list-container']" v-if="presets">
        <button v-for="preset in presets" :class="[$style.item, {
            [$style.selected]: preset == model,
        }]" @click="model = preset">
            <img :src="preset" />
        </button>
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

    .list-container {
        width: 100%;
        box-sizing: border-box;
        margin: .5em 0;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .item {
            width: 2.5em;
            height: 2.5em;
            border: .15em solid transparent;
            flex-shrink: 0;
            margin: .1em;
            border-radius: .3em;
            background-color: transparent;
            cursor: pointer;
            box-sizing: border-box;
            padding: .3em;

            & > img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }

        .item:hover {
            border-color: var(--side-menu-input-border-color);
        }

        .item.selected {
            border-color: var(--side-menu-input-border-color-focus);
        }
    }
</style>