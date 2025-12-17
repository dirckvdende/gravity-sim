<script lang="ts" setup>
    import SVGIcon from '@/ui/SVGIcon.vue';
    import { mdiFile, mdiDelete } from '@mdi/js';

    const { name, filename } = defineProps<{
        /** Readable name of the item (default same as literal filename) */
        name?: string
        /** Literal filename */
        filename: string
    }>()

    const emit = defineEmits<{
        /** Emitted when the delete button is clicked */
        (e: "delete"): void
    }>()
</script>

<template>
    <div :class="$style.container">
        <div :class="$style.icon">
            <SVGIcon :path="mdiFile" :class="$style.svg" />
        </div>
        <div :class="$style.name">
            {{ name ?? filename }}
            <span v-if="name" :class="$style.filename">({{ filename }})</span>
        </div>
        <button :class="$style.delete" @click="emit('delete')">
            <SVGIcon :path="mdiDelete" :class="$style.svg" />
        </button>
    </div>
</template>

<style lang="scss" module>
    .container {
        width: 100%;
        box-sizing: border-box;
        padding: .6em 1.5em;
        background-color: #eee;
        color: #333;
        border-radius: .5em;
        display: flex;
        align-items: center;
        height: 3em;

        .icon {
            height: 100%;
            aspect-ratio: 1 / 1;
            display: flex;
            margin-right: .8em;

            .svg {
                height: 100%;
                fill: #333;
            }
        }

        .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 100%;
            flex-shrink: 1;

            .filename {
                color: #999;
                margin-left: .4em;
            }
        }

        .delete {
            height: 100%;
            aspect-ratio: 1 / 1;
            display: flex;
            margin-left: .8em;
            box-sizing: border-box;
            padding: .3em;
            border: none;
            border-radius: 50%;
            cursor: pointer;

            &:hover {
                background-color: #0001;
            }

            .svg {
                height: 100%;
                fill: #555;
            }
        }
    }
</style>