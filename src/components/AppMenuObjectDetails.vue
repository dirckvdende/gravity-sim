<script lang="ts" setup>
    import SideMenu from '@/components/SideMenu.vue';
    import SideMenuSection from '@/components/SideMenuSection.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed, ref, useTemplateRef, watch, type ComputedRef } from
    'vue';
    import { LENGTH_UNITS, VELOCITY_UNITS, MASS_UNITS, FORCE_UNITS, TIME_UNITS }
    from '@/util/units';
    import SideMenuStat from '@/components/SideMenuStat.vue';
    import SideMenuCenterImage from '@/components/SideMenuCenterImage.vue';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import SideMenuInputContainer from
    '@/components/SideMenuInputContainer.vue';
    import SideMenuInputOptions from '@/components/SideMenuInputOptions.vue';
    import type { StyledGravityObject } from '@/util/sim/object';
    import { useObjectStats } from '@/composables/useObjectStats';
    import { useObjectCompareStats } from '@/composables/useObjectCompareStats';
    import SideMenuObjectStat from '@/components/SideMenuObjectStat.vue';
    import SideMenuObjectVectorStat from
    '@/components/SideMenuObjectVectorStat.vue';
    import { mdiDeleteOutline, mdiPencilOutline } from '@mdi/js';
    import { useDelayedFalse } from '@/composables/useDelayedFalse';

    const { objects } = storeToRefs(useGravitySimStore())
    const {
        activeMenu,
        focusedObject: trueFocusedObject,
    } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-details" && trueFocusedObject.value != null)
    const partiallyVisible = useDelayedFalse(visible, 2000)
    const focusedObject = computed(() =>
        partiallyVisible.value ? trueFocusedObject.value : null)

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
    const trueCompareObject = ref<StyledGravityObject | undefined>(undefined)
    function updateCompareObject(value: StyledGravityObject | undefined): void {
        trueCompareObject.value = value
    }
    const compareObject = computed(() =>
        partiallyVisible.value ? trueCompareObject.value : null)

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

            <SideMenuObjectStat :value="name">Name</SideMenuObjectStat>
            <SideMenuObjectStat :value="mass" :units="MASS_UNITS">Mass</SideMenuObjectStat>
            <SideMenuObjectStat :value="massProportion">Mass / total</SideMenuObjectStat>
            <SideMenuObjectStat :value="size" :units="LENGTH_UNITS">
                Diameter</SideMenuObjectStat>

            <SideMenuObjectVectorStat :value="position" :units="LENGTH_UNITS" has-graph
                ref="position-ref">Position</SideMenuObjectVectorStat>
            <SideMenuObjectVectorStat :value="velocity" :units="VELOCITY_UNITS"
                show-length has-graph ref="velocity-ref">
                Velocity</SideMenuObjectVectorStat>
            <SideMenuObjectVectorStat :value="force" :units="FORCE_UNITS" show-length
                has-graph ref="force-ref">Acting force</SideMenuObjectVectorStat>

        </SideMenuSection>
        <SideMenuSection divider>

            <SideMenuInputContainer name="Compare" style="margin-bottom: 1em;">
                <SideMenuInputOptions
                    :options="compareOptions"
                    @update="updateCompareObject" />
            </SideMenuInputContainer>

            <template v-if="compareObject && focusedObject">
                <SideMenuObjectStat :value="massRatio">Relative mass</SideMenuObjectStat>
                <SideMenuObjectStat :value="sizeRatio">Relative size</SideMenuObjectStat>

                <SideMenuObjectStat :value="distance" :units="LENGTH_UNITS" has-graph
                    ref="distance-ref">Distance</SideMenuObjectStat>
                <SideMenuObjectVectorStat :value="relativePosition"
                    ref="relative-position-ref" :units="LENGTH_UNITS" has-graph>
                    Relative position</SideMenuObjectVectorStat>
                <SideMenuObjectVectorStat :value="relativeVelocity"
                    ref="relative-velocity-ref" :units="VELOCITY_UNITS"
                    show-length has-graph>Relative velocity</SideMenuObjectVectorStat>

                <SideMenuObjectStat :value="escapeVelocity" ref="escape-velocity-ref"
                    :units="VELOCITY_UNITS" has-graph>
                    Rel. escape velocity</SideMenuObjectStat>
                <SideMenuObjectStat :value="gravBound === undefined ? undefined 
                    : gravBound ? 'yes' : 'no'" :units="VELOCITY_UNITS">
                    Grav. bound</SideMenuObjectStat>

                <SideMenuObjectStat :value="eccentricityVector?.length()"
                    ref="eccentricity-ref" has-graph>Orbital eccentricity
                    </SideMenuObjectStat>
                <SideMenuObjectStat :value="semiMajorAxis" ref="semi-major-axis-ref"
                    :units="LENGTH_UNITS" has-graph>Semi-major axis</SideMenuObjectStat>
                <SideMenuObjectStat :value="orbitalPeriod" ref="orbital-period-ref"
                    :units="TIME_UNITS" has-graph>Orbital period</SideMenuObjectStat>
            </template>

        </SideMenuSection>
    </SideMenu>
</template>