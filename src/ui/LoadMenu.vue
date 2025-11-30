<script lang="ts" setup>
    import MenuSection from './templates/MenuSection.vue';
    import SideMenu from './templates/SideMenu.vue';
    import MenuButton from './templates/MenuButton.vue';
    import { mdiFileOutline } from '@mdi/js';
    import MenuText from './templates/MenuText.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/menu';
    import { computed } from 'vue';
    import { uploadFile } from '@/util/piniaStoreToFile';

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

    function closeMenu(): void {
        activeMenu.value = "none"
    }

    function loadScenario(scenario: Scenario): void {
        // TODO
    }
</script>

<template>
    <SideMenu :visible="visible" menu-title="Load scenario" @close="closeMenu">
        <MenuSection>
            <MenuButton
                :path-icon="mdiFileOutline"
                @click="() => {
                    uploadFile('state', '.grav')
                    closeMenu()
                }">Load from file</MenuButton>
        </MenuSection>
        <MenuSection>
            <MenuText>Presets:</MenuText>
            <MenuButton
                v-for="scenario in scenarios"
                :icon="scenario.icon"
                @click="() => {
                    loadScenario(scenario)
                    closeMenu()
                }">{{ scenario.name }}</MenuButton>
        </MenuSection>
    </SideMenu>
</template>