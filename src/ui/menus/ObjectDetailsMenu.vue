<script lang="ts" setup>
    import SideMenu from './side/SideMenu.vue';
    import SideMenuSection from './side/SideMenuSection.vue';
    import SideMenuText from './side/SideMenuText.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';
    import { VELOCITY_UNITS, unitToHTML } from '@/util/units';

    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-details" && focusedObject.value != null)

    const absVelocity = computed(() => {
        const v = focusedObject.value?.velocity?.length()
        if (v === undefined)
            return "N/A"
        return unitToHTML(v, VELOCITY_UNITS)
    })

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
            <SideMenuText>Velocity: <span v-html="absVelocity"></span></SideMenuText>
        </SideMenuSection>
    </SideMenu>
</template>