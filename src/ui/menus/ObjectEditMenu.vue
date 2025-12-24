<script setup lang="ts">
    import SideMenu from './side/SideMenu.vue';
    import { mdiDeleteOutline } from '@mdi/js';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed, type Ref, type WritableComputedRef } from 'vue';
    import SideMenuInputContainer from
    './side/input/SideMenuInputContainer.vue';
    import SideMenuTextInput from './side/input/SideMenuTextInput.vue';
    import type { StyledGravityObject } from '@/sim/object';
    import SideMenuSection from './side/SideMenuSection.vue';
    import SideMenuNumberInput from './side/input/SideMenuNumberInput.vue';
    import Vector2 from '@/util/linalg/Vector2';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import SideMenuImageInput from './side/input/SideMenuImageInput.vue';

    const { objects } = storeToRefs(useGravitySimStore())
    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-edit" && focusedObject.value != null)

    /** Close this menu */
    function closeMenu(): void {
        activeMenu.value = "none"
    }

    /** Delete the currently focused object */
    function deleteObject(): void {
        objects.value = objects.value.filter((object) =>
            object != focusedObject.value)
        closeMenu()
    }

    /**
     * Get a writable computed ref that references a key in the currently
     * focused object. If there is no focused object, a default value is used
     * @param key The key in the focused object to create a ref for
     * @param defaultValue Default value to get when focused object is null
     * @returns The ref
     */
    function focusedObjectRef<K extends keyof StyledGravityObject, D>(key: K,
    defaultValue: D): WritableComputedRef<D | StyledGravityObject[K],
    StyledGravityObject[K]> {
        return computed({
            get: () => focusedObject.value?.[key] ?? defaultValue,
            set: (value) => {
                if (!focusedObject.value)
                    return
                focusedObject.value[key] = value
            }
        })
    }

    /**
     * Create separate refs for the coords of a vector, from a vector ref
     * @param vector Vector ref to turn into refs
     * @returns Separate refs for the x- and y-coord
     */
    function vectorRefs(vector: Ref<Vector2>): {
        x: WritableComputedRef<number>
        y: WritableComputedRef<number>
    } {
        return {
            x: computed({
                get: () => vector.value.x,
                set: (value) =>
                    vector.value = new Vector2(value, vector.value.y),
            }),
            y: computed({
                get: () => vector.value.y,
                set: (value) =>
                    vector.value = new Vector2(vector.value.x, value),
            }),
        }
    }

    const icon = focusedObjectRef("icon", "./icons/empty.svg")
    const name = focusedObjectRef("name", "")
    const description = focusedObjectRef("description", "")
    const mass = focusedObjectRef("mass", 1)
    const size = focusedObjectRef("size", 0)
    const { x: posX, y: posY } = vectorRefs(focusedObjectRef("position",
        Vector2.Zero))
    const { x: velX, y: velY } = vectorRefs(focusedObjectRef("velocity",
        Vector2.Zero))
</script>

<template>
    <SideMenu
        :visible="visible"
        :menu-title="`Edit: ${name}`"
        @close="closeMenu"
        :bottom-buttons="[{
            iconPath: mdiDeleteOutline,
            text: 'delete',
            click: deleteObject,
        }]">
        <SideMenuSection>
            <SideMenuImageInput v-model="icon" />
        </SideMenuSection>
        <SideMenuSection>
            <SideMenuInputContainer name="Name">
                <SideMenuTextInput v-model="name" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="Description">
                <SideMenuTextInput v-model="description" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="Mass" suffix="kg">
                <SideMenuNumberInput v-model="mass" :validator="(v) => v > 0" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="Diameter" suffix="m">
                <SideMenuNumberInput v-model="size"
                    :validator="(v) => v >= 0" />
            </SideMenuInputContainer>

            <SideMenuInputContainer name="Position" />
            <SideMenuInputContainer name="x" suffix="m" :level=1>
                <SideMenuNumberInput v-model="posX" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="y" suffix="m" :level=1>
                <SideMenuNumberInput v-model="posY" />
            </SideMenuInputContainer>

            <SideMenuInputContainer name="Velocity" />
            <SideMenuInputContainer name="x" suffix="m/s" :level=1>
                <SideMenuNumberInput v-model="velX" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="y" suffix="m/s" :level=1>
                <SideMenuNumberInput v-model="velY" />
            </SideMenuInputContainer>
        </SideMenuSection>
    </SideMenu>
</template>