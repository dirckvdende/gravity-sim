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
</script>

<template>
    <SideMenu
        :visible="visible"
        menu-title="Scenario info"
        @close="activeMenu = 'none'"
        :bottom-buttons="[{
            iconPath: mdiPencilOutline,
            text: 'edit',
            click: () => activeMenu = 'scenario-edit',
        }]">

        <SideMenuCenterImage style="margin: 1em 0 1.5em 0" :src="icon" />

        <SideMenuSection divider>
            <SideMenuObjectStat :value="name">Name</SideMenuObjectStat>
        </SideMenuSection>
    </SideMenu>
</template>