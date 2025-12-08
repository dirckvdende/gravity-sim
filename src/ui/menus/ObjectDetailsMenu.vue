<script lang="ts" setup>
    import SideMenu from './side/SideMenu.vue';
    import SideMenuSection from './side/SideMenuSection.vue';
    import SideMenuText from './side/SideMenuText.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';

    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-details" && focusedObject.value != null)

    const absVelocity = computed(() =>
        focusedObject.value?.velocity?.length() ?? "N/A")

    function closeMenu(): void {
        activeMenu.value = "none"
    }
</script>

<template>
    <SideMenu
        :visible="visible"
        :menu-title="focusedObject?.name"
        @close="closeMenu">
        <SideMenuSection>
            <SideMenuText>Velocity: {{ absVelocity }}</SideMenuText>
        </SideMenuSection>
    </SideMenu>
</template>