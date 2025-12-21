<script lang="ts" setup>
    import SVGIcon from '@/ui/SVGIcon.vue';
    import { mdiFile, mdiDeleteOutline } from '@mdi/js';

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
        <div :class="$style.main">
            <div :class="$style.name">
                {{ name ?? filename }}
                <span v-if="name" :class="$style.filename">
                    ({{ filename }})
                </span>
            </div>
            <div v-if="$slots.subtext" :class="$style.subtext">
                <slot name="subtext" />
            </div>
            <div v-if="$slots['subtext-warn']" :class="[$style.subtext,
            $style['subtext-warn']]">
                <slot name="subtext-warn" />
            </div>
        </div>
        <button :class="$style.delete" @click="emit('delete')">
            <SVGIcon :path="mdiDeleteOutline" :class="$style.svg" />
        </button>
    </div>
</template>

<style lang="scss" module>
    .container {
        width: 100%;
        box-sizing: border-box;
        padding: .5em 1.5em;
        background-color: #eee;
        color: #333;
        border-radius: .5em;
        display: flex;
        align-items: center;
        min-height: 3.4em;
        margin-bottom: .5em;

        .icon {
            height: 1.8em;
            aspect-ratio: 1 / 1;
            display: flex;
            margin-right: .8em;
            box-sizing: border-box;

            .svg {
                height: 100%;
                fill: #333;
            }
        }

        .main {
            display: flex;
            width: 100%;
            flex-shrink: 1;
            align-items: flex-start;
            flex-direction: column;

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

            .subtext {
                display: flex;
                align-items: flex-end;
                width: 100%;
                flex-shrink: 1;
                flex-wrap: wrap;
                font-size: .6em;
                color: #aaa;
            }

            .subtext.subtext-warn {
                color: #da920c;
            }
        }

        .delete {
            height: 2.6em;
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