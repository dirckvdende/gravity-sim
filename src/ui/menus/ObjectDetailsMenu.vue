<script lang="ts" setup>
    import SideMenu from './side/SideMenu.vue';
    import SideMenuSection from './side/SideMenuSection.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed, ref, useTemplateRef, watch, type ComputedRef } from 'vue';
    import { LENGTH_UNITS, VELOCITY_UNITS, MASS_UNITS, FORCE_UNITS, TIME_UNITS } from
    '@/util/units';
    import SideMenuStat from './side/SideMenuStat.vue';
    import SideMenuCenterImage from './side/SideMenuCenterImage.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import SideMenuInputContainer from
    './side/input/SideMenuInputContainer.vue';
    import SideMenuOptionsInput from './side/input/SideMenuOptionsInput.vue';
    import type { StyledGravityObject } from '@/sim/object';
    import { useObjectStats } from '@/sim/useObjectStats';
    import { useObjectCompareStats } from '@/sim/useObjectCompareStats';
    import LineGraph2D from '../graphs/LineGraph2D.vue';
    import { mdiChartLine } from '@mdi/js';

    const { objects } = storeToRefs(useGravitySimStore())
    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-details" && focusedObject.value != null)

    function closeMenu(): void {
        activeMenu.value = "none"
    }

    const compareOptions: ComputedRef<{
        value: StyledGravityObject
        name: string
        icon: string
    }[]> = computed(() => 
        objects.value.filter((object) => object != focusedObject.value)
        .map((object) => ({
            value: object,
            name: object.name,
            icon: object.icon,
        }))
    )

    // Object selector for comparisons
    const compareObject = ref<StyledGravityObject | undefined>(undefined)
    function updateCompareObject(value: StyledGravityObject | undefined): void {
        compareObject.value = value
    }

    const {
        name, mass, size, position, velocity, force, massProportion,
    } = useObjectStats(focusedObject, objects)

    const {
        distance, massRatio, sizeRatio, relativePosition, relativeVelocity,
        escapeVelocity, gravBound, eccentricityVector, semiMajorAxis,
        orbitalPeriod,
    } = useObjectCompareStats(focusedObject, compareObject, objects)

    const relPosGraph = useTemplateRef("relative-position-graph")
    watch([compareObject, focusedObject], () => relPosGraph.value?.clear(), {
        deep: false })

    const relPosGraphVisible = ref(false)
    function toggleRelPosGraph(): void {
        relPosGraphVisible.value = !relPosGraphVisible.value
    }
</script>

<template>
    <SideMenu
        :visible="visible"
        :menu-title="name"
        @close="closeMenu">

        <SideMenuCenterImage v-if="focusedObject" style="margin: 1em 0 1.5em 0"
            :src="focusedObject?.icon" />

        <SideMenuSection v-if="focusedObject?.description">
            <SideMenuStat :value="focusedObject.description" large>Description
                </SideMenuStat>
        </SideMenuSection>

        <SideMenuSection>

            <SideMenuStat :value="name">Name</SideMenuStat>
            <SideMenuStat :value="mass" :units="MASS_UNITS">Mass</SideMenuStat>
            <SideMenuStat :value="massProportion">Mass / total</SideMenuStat>
            <SideMenuStat :value="size" :units="LENGTH_UNITS">Diameter
                </SideMenuStat>

            <SideMenuStat :value="null">Position</SideMenuStat>
            <SideMenuStat :value="position?.x" :units="LENGTH_UNITS"
                :level=1>x</SideMenuStat>
            <SideMenuStat :value="position?.y" :units="LENGTH_UNITS"
                :level=1>y</SideMenuStat>

            <SideMenuStat :value="velocity?.length()"
                :units="VELOCITY_UNITS">Velocity</SideMenuStat>
            <SideMenuStat :value="velocity?.x" :units="VELOCITY_UNITS"
                :level=1>x</SideMenuStat>
            <SideMenuStat :value="velocity?.y" :units="VELOCITY_UNITS"
                :level=1>y</SideMenuStat>

            <SideMenuStat :value="force?.length()"
                :units="FORCE_UNITS">Acting force</SideMenuStat>
            <SideMenuStat :value="force?.x"
                :units="FORCE_UNITS" :level=1>x</SideMenuStat>
            <SideMenuStat :value="force?.y"
                :units="FORCE_UNITS" :level=1>y</SideMenuStat>

        </SideMenuSection>
        <SideMenuSection>

            <SideMenuInputContainer name="Compare" style="margin-bottom: 1em;">
                <SideMenuOptionsInput
                    :options="compareOptions"
                    @update="updateCompareObject" />
            </SideMenuInputContainer>

            <template v-if="compareObject && focusedObject">
                <SideMenuStat :value="distance" :units="LENGTH_UNITS">Distance
                    </SideMenuStat>
                <SideMenuStat :value="massRatio">Relative mass</SideMenuStat>
                <SideMenuStat :value="sizeRatio">Relative size</SideMenuStat>

                <SideMenuStat :value="null" :buttons="[{
                    name: 'Show graph',
                    active: relPosGraphVisible,
                    iconPath: mdiChartLine,
                    click: toggleRelPosGraph,
                }]">Relative position</SideMenuStat>
                <SideMenuStat :value="relativePosition?.x" :units="LENGTH_UNITS"
                    :level=1>x</SideMenuStat>
                <SideMenuStat :value="relativePosition?.y" :units="LENGTH_UNITS"
                    :level=1>y</SideMenuStat>

                <LineGraph2D :point="relativePosition" draw-point
                    draw-center-point ref="relative-position-graph"
                    v-if="relPosGraphVisible" />

                <SideMenuStat :value="relativeVelocity?.length()"
                    :units="VELOCITY_UNITS">Relative velocity</SideMenuStat>
                <SideMenuStat :value="relativeVelocity?.x"
                    :units="VELOCITY_UNITS" :level=1>x</SideMenuStat>
                <SideMenuStat :value="relativeVelocity?.y"
                    :units="VELOCITY_UNITS" :level=1>y</SideMenuStat>

                <SideMenuStat :value="escapeVelocity" :units="VELOCITY_UNITS">
                    Rel. escape velocity</SideMenuStat>
                <SideMenuStat :value="gravBound === undefined ? undefined 
                    : gravBound ? 'yes' : 'no'" :units="VELOCITY_UNITS">
                    Grav. bound</SideMenuStat>

                <SideMenuStat :value="eccentricityVector?.length()">
                    Orbital eccentricity</SideMenuStat>
                <SideMenuStat :value="semiMajorAxis" :units="LENGTH_UNITS">
                    Semi-major axis</SideMenuStat>
                <SideMenuStat :value="orbitalPeriod" :units="TIME_UNITS">
                    Orbital period</SideMenuStat>
            </template>

        </SideMenuSection>
    </SideMenu>
</template>