<script lang="ts" setup>
    import SideMenu from './side/SideMenu.vue';
    import SideMenuSection from './side/SideMenuSection.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';
    import { LENGTH_UNITS, VELOCITY_UNITS } from '@/util/units';
    import SideMenuStat from './side/SideMenuStat.vue';

    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-details" && focusedObject.value != null)

    const position = computed(() => focusedObject.value?.position)
    const velocity = computed(() => focusedObject.value?.velocity)
    const absVelocity = computed(() => velocity.value?.length())

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

            <SideMenuStat :value="null">Position</SideMenuStat>
            <SideMenuStat v-if="position" :value="position.x"
                :units="LENGTH_UNITS" :level=1>x</SideMenuStat>
            <SideMenuStat v-if="position" :value="position.y"
                :units="LENGTH_UNITS" :level=1>y</SideMenuStat>

            <SideMenuStat :value="absVelocity"
                :units="VELOCITY_UNITS">Velocity</SideMenuStat>
            <SideMenuStat v-if="velocity" :value="velocity.x"
                :units="VELOCITY_UNITS" :level=1>x</SideMenuStat>
            <SideMenuStat v-if="velocity" :value="velocity.y"
                :units="VELOCITY_UNITS" :level=1>y</SideMenuStat>

        </SideMenuSection>
    </SideMenu>
</template>