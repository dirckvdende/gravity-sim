<script setup lang="ts">
    import SVGIcon from './SVGIcon.vue';

    const { icon } = defineProps<{
        /** Path to the icon of the button */
        icon?: string,
    }>()

    const emit = defineEmits<{
        /** Emitted when the button is clicked */
        (e: "click", event: PointerEvent): void,
    }>()
</script>

<template>
    <button class="menu-button" @click="(event) => emit('click', event)">
        <SVGIcon v-if="icon" :path="icon" class="menu-button-icon" />
        <div class="menu-button-text">
            <slot />
        </div>
    </button>
</template>