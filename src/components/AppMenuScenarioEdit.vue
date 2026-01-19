<script setup lang="ts">
    import SideMenu from '@/components/SideMenu.vue';
    import { storeToRefs } from 'pinia';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { computed } from 'vue';
    import SideMenuInputContainer from
    '@/components/SideMenuInputContainer.vue';
    import SideMenuTextInput from '@/components/SideMenuInputText.vue';
    import SideMenuSection from '@/components/SideMenuSection.vue';
    import SideMenuInputImage from '@/components/SideMenuInputImage.vue';
    import sunIcon from '@/assets/icons/sun.svg'
    import moonIcon from '@/assets/icons/moon.svg'
    import mercuryIcon from '@/assets/icons/mercury.svg'
    import venusIcon from '@/assets/icons/venus.svg'
    import earthIcon from '@/assets/icons/earth.svg'
    import marsIcon from '@/assets/icons/mars.svg'
    import jupiterIcon from '@/assets/icons/jupiter.svg'
    import saturnIcon from '@/assets/icons/saturn.svg'
    import uranusIcon from '@/assets/icons/uranus.svg'
    import neptuneIcon from '@/assets/icons/neptune.svg'
    import plutoIcon from '@/assets/icons/pluto.svg'
    import charonIcon from '@/assets/icons/charon.svg'
    import nixIcon from '@/assets/icons/nix.svg'
    import kerberosIcon from '@/assets/icons/kerberos.svg'
    import { usePropertiesStore } from '@/stores/usePropertiesStore';

    const { activeMenu } = storeToRefs(useMenuStore())
    const visible = computed(() =>
        activeMenu.value == "scenario-edit")

    const { icon, name, description } = storeToRefs(usePropertiesStore())
</script>

<template>
    <SideMenu
        :visible="visible"
        menu-title="Edit scenario"
        @close="activeMenu = 'none'">
        <SideMenuSection>
            <SideMenuInputImage v-model="icon" :presets="[
                sunIcon,
                moonIcon,
                mercuryIcon,
                venusIcon,
                earthIcon,
                marsIcon,
                jupiterIcon,
                saturnIcon,
                uranusIcon,
                neptuneIcon,
                plutoIcon,
                charonIcon,
                nixIcon,
                kerberosIcon,
            ]" />
        </SideMenuSection>
        <SideMenuSection>
            <SideMenuInputContainer name="Name">
                <SideMenuTextInput v-model="name" />
            </SideMenuInputContainer>
            <SideMenuInputContainer name="Description">
                <SideMenuTextInput v-model="description" />
            </SideMenuInputContainer>
        </SideMenuSection>
    </SideMenu>
</template>