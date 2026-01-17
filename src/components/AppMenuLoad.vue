<script lang="ts" setup>
    import SideMenu from '@/components/SideMenu.vue';
    import SideMenuSection from '@/components/SideMenuSection.vue';
    import SideMenuButton from '@/components/SideMenuButton.vue';
    import { mdiContentSaveOutline, mdiFolderOpenOutline } from '@mdi/js';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed, ref } from 'vue';
    import { loadFromFile, loadFromURL, saveToFile } from
    '@/util/filesystem/save.mjs';
    import { getState, setState } from '@/util/filesystem/state.mjs';
    import { scenarioURLs } from '@/util/assetURLs';
    import type { StateFile } from '@/util/filesystem/statefile.mjs';
import PopupModal from './PopupModal.vue';

    // List of predefined scenarios, loaded asynchronously
    const scenarios = ref<StateFile[]>([])
    loadScenarios()

    const { activeMenu } = storeToRefs(useMenuStore())
    const visible = computed(() => activeMenu.value == "load")

    /**
     * Close the load menu
     */
    function closeMenu(): void {
        activeMenu.value = "none"
    }

    /**
     * Load all predefined scenarios to the scenarios ref asynchronously.
     * Scenarios ref is sorted alphabetically after every insert
     */
    function loadScenarios(): void {
        for (const url of scenarioURLs) {
            loadFromURL(url).then((state) => {
                scenarios.value.push(state)
                scenarios.value.sort((stateA, stateB) => {
                    const nameA = stateA.name.toUpperCase()
                    const nameB = stateB.name.toUpperCase()
                    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
                })
            })
        }
    }

    const popupText = ref<null | string>(null)
</script>

<template>
    <SideMenu :visible="visible" menu-title="Load scenario" @close="closeMenu">
        <SideMenuSection style="padding-top: .5em;">
            <SideMenuButton
                :path-icon="mdiFolderOpenOutline"
                @click="loadFromFile()
                    .then((state) => setState(state))
                    .catch((reason) => popupText = reason.toString())">
                Load from file</SideMenuButton>
            <SideMenuButton
                :path-icon="mdiContentSaveOutline"
                @click="() => saveToFile(getState())">
                Save to file</SideMenuButton>
        </SideMenuSection>
        <SideMenuSection>
            <SideMenuButton
                v-for="state in scenarios"
                :icon="state.icon"
                @click="() => setState(state)">{{ state.name }}</SideMenuButton>
        </SideMenuSection>
    </SideMenu>
    <PopupModal v-if="popupText" @close="popupText = null">
        <template #head>Error</template>
        {{ popupText }}
    </PopupModal>
</template>