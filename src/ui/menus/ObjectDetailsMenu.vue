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
    import ObjectStat from './objectdetails/ObjectStat.vue';
    import ObjectVectorStat from './objectdetails/ObjectVectorStat.vue';
    import { mdiDeleteOutline, mdiPencilOutline } from '@mdi/js';

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

    const graphComponents = [
        useTemplateRef("position-ref"),
        useTemplateRef("velocity-ref"),
        useTemplateRef("force-ref"),
    ]
    watch(focusedObject, () => {
        for (const component of graphComponents)
            component.value?.clearGraph()
    }, { deep: false })
    const compareGraphComponents = [
        useTemplateRef("distance-ref"),
        useTemplateRef("relative-position-ref"),
        useTemplateRef("relative-velocity-ref"),
        useTemplateRef("escape-velocity-ref"),
        useTemplateRef("eccentricity-ref"),
        useTemplateRef("semi-major-axis-ref"),
        useTemplateRef("orbital-period-ref"),
    ]
    watch([compareObject, focusedObject], () => {
        for (const component of compareGraphComponents)
            component.value?.clearGraph()
    }, { deep: false })

    /** Delete the currently focused object */
    function deleteObject(): void {
        objects.value = objects.value.filter((object) =>
            object != focusedObject.value)
        closeMenu()
    }

    /** Edit the currently focused object */
    function editObject(): void {
        // NOTE: focused object is already set correctly
        activeMenu.value = "object-edit"
    }
</script>

<template>
    <SideMenu
        :visible="visible"
        :menu-title="name"
        @close="closeMenu"
        :bottom-buttons="[{
            iconPath: mdiPencilOutline,
            text: 'edit',
            click: editObject,
        }, {
            iconPath: mdiDeleteOutline,
            text: 'delete',
            click: deleteObject,
        }]">

        <SideMenuCenterImage v-if="focusedObject" style="margin: 1em 0 1.5em 0"
            :src="focusedObject?.icon" />

        <SideMenuSection v-if="focusedObject?.description" divider>
            <SideMenuStat :value="focusedObject.description" large>Description
                </SideMenuStat>
        </SideMenuSection>

        <SideMenuSection divider>

            <ObjectStat :value="name">Name</ObjectStat>
            <ObjectStat :value="mass" :units="MASS_UNITS">Mass</ObjectStat>
            <ObjectStat :value="massProportion">Mass / total</ObjectStat>
            <ObjectStat :value="size" :units="LENGTH_UNITS">
                Diameter</ObjectStat>

            <ObjectVectorStat :value="position" :units="LENGTH_UNITS" has-graph
                ref="position-ref">Position</ObjectVectorStat>
            <ObjectVectorStat :value="velocity" :units="VELOCITY_UNITS"
                show-length has-graph ref="velocity-ref">
                Velocity</ObjectVectorStat>
            <ObjectVectorStat :value="force" :units="FORCE_UNITS" show-length
                has-graph ref="force-ref">Acting force</ObjectVectorStat>

        </SideMenuSection>
        <SideMenuSection divider>

            <SideMenuInputContainer name="Compare" style="margin-bottom: 1em;">
                <SideMenuOptionsInput
                    :options="compareOptions"
                    @update="updateCompareObject" />
            </SideMenuInputContainer>

            <template v-if="compareObject && focusedObject">
                <ObjectStat :value="massRatio">Relative mass</ObjectStat>
                <ObjectStat :value="sizeRatio">Relative size</ObjectStat>

                <ObjectStat :value="distance" :units="LENGTH_UNITS" has-graph
                    ref="distance-ref">Distance</ObjectStat>
                <ObjectVectorStat :value="relativePosition"
                    ref="relative-position-ref" :units="LENGTH_UNITS" has-graph>
                    Relative position</ObjectVectorStat>
                <ObjectVectorStat :value="relativeVelocity"
                    ref="relative-velocity-ref" :units="VELOCITY_UNITS"
                    show-length has-graph>Relative velocity</ObjectVectorStat>

                <ObjectStat :value="escapeVelocity" ref="escape-velocity-ref"
                    :units="VELOCITY_UNITS" has-graph>
                    Rel. escape velocity</ObjectStat>
                <ObjectStat :value="gravBound === undefined ? undefined 
                    : gravBound ? 'yes' : 'no'" :units="VELOCITY_UNITS">
                    Grav. bound</ObjectStat>

                <ObjectStat :value="eccentricityVector?.length()"
                    ref="eccentricity-ref" has-graph>Orbital eccentricity
                    </ObjectStat>
                <ObjectStat :value="semiMajorAxis" ref="semi-major-axis-ref"
                    :units="LENGTH_UNITS" has-graph>Semi-major axis</ObjectStat>
                <ObjectStat :value="orbitalPeriod" ref="orbital-period-ref"
                    :units="TIME_UNITS" has-graph>Orbital period</ObjectStat>
            </template>

        </SideMenuSection>
    </SideMenu>
</template>