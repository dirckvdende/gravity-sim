<script lang="ts" setup>
    import MenuSection from './templates/MenuSection.vue';
    import SideMenu from './templates/SideMenu.vue';
    import MenuText from './templates/MenuText.vue';
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
        <MenuSection>
            <MenuText>Velocity: {{ absVelocity }}</MenuText>
        </MenuSection>
    </SideMenu>
</template>