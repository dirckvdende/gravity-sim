<script setup lang="ts">
    import SVGIcon from './SVGIcon.vue';

    const { pathIcon, icon } = defineProps<{
        /** SVG path of the icon of the button */
        pathIcon?: string,
        /** Icon of the button as a url */
        icon?: string,
    }>()

    const emit = defineEmits<{
        /** Emitted when the button is clicked */
        (e: "click", event: PointerEvent): void,
    }>()
</script>

<template>
    <button class="menu-button" @click="(event) => emit('click', event)">
        <SVGIcon
            v-if="pathIcon"
            :path="pathIcon"
            class="menu-button-path-icon" />
        <div v-else-if="icon" class="menu-button-icon">
            <img :src="icon" />
        </div>
        <div class="menu-button-text">
            <slot />
        </div>
    </button>
</template>