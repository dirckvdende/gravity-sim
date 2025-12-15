<script lang="ts" setup>
    import SideMenu from './side/SideMenu.vue';
    import SideMenuSection from './side/SideMenuSection.vue';
    import SideMenuButton from './side/SideMenuButton.vue';
    import SideMenuText from './side/SideMenuText.vue';
    import { mdiFolderOpenOutline } from '@mdi/js';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';
    import { loadFromString } from '@/util/piniaStoreToFile';
    import { useOrbitHistoryStore } from '@/stores/useOrbitHistoryStore';
    import { loadFromFile } from '@/filesystem/save.mjs';
    import { setState } from '@/filesystem/state.mjs';

    type Scenario = {
        name: string,
        file: string,
        icon: string,
    }

    const scenarios: Scenario[] = [{
        name: "Pluto system",
        file: "./scenarios/pluto.grav",
        icon: "./icons/pluto.svg",
    }, {
        name: "Earth and moon",
        file: "./scenarios/earth-moon.grav",
        icon: "./icons/earth.svg",
    }]

    const { activeMenu } = storeToRefs(useMenuStore())
    const visible = computed(() => activeMenu.value == "load")
    const { clearOrbits } = useOrbitHistoryStore()

    function closeMenu(): void {
        activeMenu.value = "none"
    }

    function loadScenario({ file }: Scenario): void {
        fetch(file).then((response) =>
            response.text().then((text) => {
                loadFromString("state", text)
                clearOrbits()
            }))
    }
</script>

<template>
    <SideMenu :visible="visible" menu-title="Load scenario" @close="closeMenu">
        <SideMenuSection>
            <SideMenuButton
                :path-icon="mdiFolderOpenOutline"
                @click="() => loadFromFile().then((state) => {
                    setState(state)
                    clearOrbits()
                    closeMenu()
                })">Load from file</SideMenuButton>
        </SideMenuSection>
        <SideMenuSection>
            <SideMenuText>Presets:</SideMenuText>
            <SideMenuButton
                v-for="scenario in scenarios"
                :icon="scenario.icon"
                @click="() => {
                    loadScenario(scenario)
                    closeMenu()
                }">{{ scenario.name }}</SideMenuButton>
        </SideMenuSection>
    </SideMenu>
</template>