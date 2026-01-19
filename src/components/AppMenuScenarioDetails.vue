<script lang="ts" setup>
    import SideMenu from '@/components/SideMenu.vue';
    import SideMenuSection from '@/components/SideMenuSection.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';
    import SideMenuCenterImage from '@/components/SideMenuCenterImage.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { mdiPencilOutline } from '@mdi/js';
    import { usePropertiesStore } from '@/stores/usePropertiesStore';
    import SideMenuStat from './SideMenuStat.vue';
    import { LENGTH_UNITS, MASS_UNITS } from '@/util/units';
    import SideMenuObjectVectorStat from './SideMenuObjectVectorStat.vue';
    import SideMenuText from './SideMenuText.vue';

    const { name, icon, description } = storeToRefs(usePropertiesStore())
    const {
        activeMenu,
    } = storeToRefs(useMenuStore())
    const visible = computed(() => activeMenu.value == "scenario-details")

    const { objects, barycenter } = storeToRefs(useGravitySimStore())
    const totalMass = computed(() =>
        objects.value.reduce((prev, cur) => prev + cur.mass, 0))
    const objectCount = computed(() => objects.value.length)

    const appVersion = import.meta.env.VITE_APP_VERSION
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
            <SideMenuStat :value="name">Name</SideMenuStat>
            <SideMenuStat :value="description" large v-if="description">
                Description
            </SideMenuStat>
        </SideMenuSection>

        <SideMenuSection divider>
            <SideMenuStat :value="objectCount.toFixed(0)">
                Objects
            </SideMenuStat>
            <SideMenuStat :value="totalMass" :units="MASS_UNITS">
                Total mass
            </SideMenuStat>
            <SideMenuObjectVectorStat :value="barycenter" :units="LENGTH_UNITS">
                Barycenter
            </SideMenuObjectVectorStat>
        </SideMenuSection>

        <SideMenuSection divider>
            <SideMenuText>
                Gravity sim created by <a target="_blank"
                href="https://dirck.dev/">Dirck van den Ende</a><br />
                <a target="_blank"
                href="https://github.com/dirckvdende/gravity-sim"> Source
                code</a>&nbsp;·&nbsp;<a target="_blank"
                href="./horizons-data-import">Horizons import tool</a>
            </SideMenuText>
            <SideMenuText>
                App version
                <template v-if="appVersion === undefined">unknown</template>
                <template v-else-if="appVersion.startsWith('git:')">
                    <a
                        target="_blank"
                        :href="`https://github.com/dirckvdende/gravity-sim/` +
                        `commit/${appVersion.substring(4)}`">
                        {{ appVersion.substring(4, 11) }}
                    </a>
                </template>
                <template v-else="appVersion">{{ appVersion }}</template>
            </SideMenuText>
        </SideMenuSection>
    </SideMenu>
</template>