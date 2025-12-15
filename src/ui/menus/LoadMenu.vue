<script lang="ts" setup>
    import SideMenu from './side/SideMenu.vue';
    import SideMenuSection from './side/SideMenuSection.vue';
    import SideMenuButton from './side/SideMenuButton.vue';
    import SideMenuText from './side/SideMenuText.vue';
    import { mdiFolderOpenOutline } from '@mdi/js';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed, ref } from 'vue';
    import { loadFromFile, loadFromURL } from '@/filesystem/save.mjs';
    import { setState } from '@/filesystem/state.mjs';
    import { scenariosList } from '@/filesystem/scenarioslist.mjs';
    import type { StateFile } from '@/filesystem/statefile.mjs';

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
        for (const url of scenariosList()) {
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
</script>

<template>
    <SideMenu :visible="visible" menu-title="Load scenario" @close="closeMenu">
        <SideMenuSection>
            <SideMenuButton
                :path-icon="mdiFolderOpenOutline"
                @click="() => loadFromFile().then((state) => setState(state))">
                Load from file</SideMenuButton>
        </SideMenuSection>
        <SideMenuSection>
            <SideMenuText>Presets:</SideMenuText>
            <SideMenuButton
                v-for="state in scenarios"
                :icon="state.icon"
                @click="() => setState(state)">{{ state.name }}</SideMenuButton>
        </SideMenuSection>
    </SideMenu>
</template>