<script setup lang="ts">
    import SideMenu from './side/SideMenu.vue';
    import { mdiDeleteOutline } from '@mdi/js';
    import { storeToRefs } from 'pinia';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';

    const { objects } = storeToRefs(useGravitySimStore())
    const { activeMenu, focusedObject } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "object-edit" && focusedObject.value != null)

    function closeMenu(): void {
        activeMenu.value = "none"
    }
</script>

<template>
    <SideMenu
        :visible="visible"
        menu-title="Edit object"
        @close="closeMenu"
        :bottom-buttons="[{
            iconPath: mdiDeleteOutline,
            text: 'delete',
            click: () => console.log('delete'),
        }]">
        Hello
    </SideMenu>
</template>