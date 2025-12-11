<script lang="ts" setup>
    import SideMenu from './side/SideMenu.vue';
    import SideMenuSection from './side/SideMenuSection.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed, ref, type ComputedRef } from 'vue';
    import { LENGTH_UNITS, VELOCITY_UNITS, MASS_UNITS, FORCE_UNITS } from
    '@/util/units';
    import SideMenuStat from './side/SideMenuStat.vue';
    import SideMenuCenterImage from './side/SideMenuCenterImage.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import SideMenuInputContainer from
    './side/input/SideMenuInputContainer.vue';
    import SideMenuOptionsInput from './side/input/SideMenuOptionsInput.vue';
    import type { StyledGravityObject } from '@/sim/object';
    import { DISTANCE_SMOOTHING, GRAV_CONSTANT } from '@/sim/constants';
    import { useObjectStats } from '@/sim/useObjectStats';

    const { objects } = storeToRefs(useGravitySimStore())
    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-details" && focusedObject.value != null)

    const {
        name, mass, size, position, velocity, force,
    } = useObjectStats(focusedObject, objects)

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

    const comparePosition = computed(() => {
        if (!focusedObject.value || !compareObject.value)
            return
        return focusedObject.value.position.subtract(
            compareObject.value.position)
    })

    const compareVelocity = computed(() => {
        if (!focusedObject.value || !compareObject.value)
            return
        return focusedObject.value.velocity.subtract(
            compareObject.value.velocity)
    })

    const compareEscapeVelocity = computed(() => {
        if (!compareObject.value || !focusedObject.value)
            return
        const mass = compareObject.value.mass + focusedObject.value.mass
        const distance = compareObject.value.position.distanceTo(
            focusedObject.value.position)
        return Math.sqrt(2 * GRAV_CONSTANT * mass / (distance +
            DISTANCE_SMOOTHING))
    })

    const compareGravBound = computed(() => {
        if (compareEscapeVelocity.value === undefined
        || compareVelocity.value === undefined)
            return undefined
        return compareVelocity.value.length() < compareEscapeVelocity.value
    })
</script>

<template>
    <SideMenu
        :visible="visible"
        :menu-title="name"
        @close="closeMenu">
        <SideMenuSection>

            <SideMenuCenterImage v-if="focusedObject" style="margin-top: 0;"
                :src="focusedObject?.icon" />

            <SideMenuStat :value="name">Name</SideMenuStat>
            <SideMenuStat :value="mass" :units="MASS_UNITS">Mass</SideMenuStat>
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

            <SideMenuInputContainer name="Compare">
                <SideMenuOptionsInput
                    :options="compareOptions"
                    @update="updateCompareObject" />
            </SideMenuInputContainer>

            <template v-if="compareObject && focusedObject">
                <SideMenuStat :value="compareObject.position.distanceTo(
                    focusedObject?.position)"
                    :units="LENGTH_UNITS">Distance</SideMenuStat>
                <SideMenuStat :value="focusedObject.mass / compareObject.mass">
                    Relative mass</SideMenuStat>
                <SideMenuStat :value="focusedObject.size / compareObject.size">
                    Relative size</SideMenuStat>

                <SideMenuStat :value="null">Relative position</SideMenuStat>
                <SideMenuStat :value="comparePosition?.x" :units="LENGTH_UNITS"
                    :level=1>x</SideMenuStat>
                <SideMenuStat :value="comparePosition?.y" :units="LENGTH_UNITS"
                    :level=1>y</SideMenuStat>

                <SideMenuStat :value="compareVelocity?.length()"
                    :units="VELOCITY_UNITS">Relative velocity</SideMenuStat>
                <SideMenuStat :value="compareVelocity?.x"
                    :units="VELOCITY_UNITS" :level=1>x</SideMenuStat>
                <SideMenuStat :value="compareVelocity?.y"
                    :units="VELOCITY_UNITS" :level=1>y</SideMenuStat>

                <SideMenuStat :value="compareEscapeVelocity"
                    :units="VELOCITY_UNITS">Rel. escape velocity</SideMenuStat>
                <SideMenuStat :value="compareGravBound === undefined ? undefined 
                    : compareGravBound ? 'yes' : 'no'"
                    :units="VELOCITY_UNITS">Grav. bound</SideMenuStat>
            </template>

        </SideMenuSection>
    </SideMenu>
</template>