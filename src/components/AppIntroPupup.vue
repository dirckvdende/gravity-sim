<script lang="ts" setup>
    import { ref } from 'vue';
    import PopupModal from './PopupModal.vue';
    import SideMenuBottomButtons from './SideMenuBottomButtons.vue';
    const visible = ref(true)
</script>

<template>
    <PopupModal @close="visible = false" v-if="visible">
        <template #head>Welcome!</template>
        <p :class="$style.p">
            This is an interactive gravity simulator, mainly intended for
            educational purposes. In this simulator you can add, modify and
            track objects. Click on an object to show details, and use the menu
            on the bottom to discover other functionalities.
        </p>
        <p>
            You can load some preset scenarios by clicking the folder icon at
            the bottom.
        </p>
        <p>
            <i>Important: This application doesn't work properly in some browsers
            (most notably Firefox). Please use Google Chrome if you're
            experiencing issues.</i>
        </p>
        <SideMenuBottomButtons :buttons="[{
            click: () => visible = false,
            text: 'Get started',
        }]" style="font-size: 1.1em; padding: 0;" />
    </PopupModal>
</template>

<style lang="scss" module>
    .p {
        margin: .3em 0;
    }
</style>