<script setup lang="ts">
    import SideMenu from './side/SideMenu.vue';
    import { mdiDeleteOutline } from '@mdi/js';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed, type WritableComputedRef } from 'vue';
    import SideMenuInputContainer from
    './side/input/SideMenuInputContainer.vue';
    import SideMenuTextInput from './side/input/SideMenuTextInput.vue';
    import type { StyledGravityObject } from '@/sim/object';
    import SideMenuSection from './side/SideMenuSection.vue';
    import SideMenuNumberInput from './side/input/SideMenuNumberInput.vue';
    import Vector2 from '@/util/linalg/Vector2';

    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-edit" && focusedObject.value != null)

    /** Close this menu */
    function closeMenu(): void {
        activeMenu.value = "none"
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

    const name = focusedObjectRef("name", "")
    const description = focusedObjectRef("description", "")
    const mass = focusedObjectRef("mass", 0)
    const position = focusedObjectRef("position", Vector2.Zero)
    const posX = computed({
        get: () => position.value.x,
        set: (value) => position.value = new Vector2(value, position.value.y),
    })
    const posY = computed({
        get: () => position.value.y,
        set: (value) => position.value = new Vector2(position.value.x, value),
    })
</script>

<template>
    <SideMenu
        :visible="visible"
        :menu-title="`Edit: ${name}`"
        @close="closeMenu"
        :bottom-buttons="[{
            iconPath: mdiDeleteOutline,
            text: 'delete',
            click: () => console.log('delete'),
        }]">
        <SideMenuSection>
            <SideMenuInputContainer name="Name">
                <SideMenuTextInput v-model="name" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="Description">
                <SideMenuTextInput v-model="description" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="Mass" suffix="kg">
                <SideMenuNumberInput v-model="mass" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="Position" />
            <SideMenuInputContainer name="x" suffix="m" :level=1>
                <SideMenuNumberInput v-model="posX" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="y" suffix="m" :level=1>
                <SideMenuNumberInput v-model="posY" />
            </SideMenuInputContainer>
        </SideMenuSection>
    </SideMenu>
</template>