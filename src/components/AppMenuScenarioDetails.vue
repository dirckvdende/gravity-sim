<script lang="ts" setup>
    import SideMenu from '@/components/SideMenu.vue';
    import SideMenuSection from '@/components/SideMenuSection.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';
    import SideMenuCenterImage from '@/components/SideMenuCenterImage.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import SideMenuObjectStat from '@/components/SideMenuObjectStat.vue';
    import { mdiPencilOutline } from '@mdi/js';
    import { usePropertiesStore } from '@/stores/usePropertiesStore';

    const { name, icon } = storeToRefs(usePropertiesStore())
    const {
        activeMenu,
    } = storeToRefs(useMenuStore())
    const visible = computed(() => activeMenu.value == "scenario-details")

    /** Close the current menu */
    function closeMenu(): void {
        activeMenu.value = "none"
    }

    /** Edit the scenario info */
    function editScenario(): void {
        activeMenu.value = "scenario-edit"
    }
</script>

<template>
    <SideMenu
        :visible="visible"
        menu-title="Scenario info"
        @close="closeMenu"
        :bottom-buttons="[{
            iconPath: mdiPencilOutline,
            text: 'edit',
            click: editScenario,
        }]">

        <SideMenuCenterImage style="margin: 1em 0 1.5em 0" :src="icon" />

        <SideMenuSection divider>
            <SideMenuObjectStat :value="name">Name</SideMenuObjectStat>
        </SideMenuSection>
    </SideMenu>
</template>