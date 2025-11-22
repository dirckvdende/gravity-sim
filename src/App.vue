<script setup lang="ts">
    import Map from './map/Map.vue';
    import { useGravitySim } from './gravitySim';
    import Vector2 from './util/Vector2';
    import { computed } from 'vue';

    const { objects } = useGravitySim({
        // 1 day / second
        speed: 60 * 60 * 24,
    })

    objects.value.push({
        icon: './icons/earth.svg',
        position: new Vector2(-4_670_000, 0),
        size: 12_742_000,
        mass: 5.972e24,
        velocity: new Vector2(0, -12.40),
    })

    objects.value.push({
        icon: './icons/moon.svg',
        position: new Vector2(384_784_000, 0),
        size: 3_474_800,
        mass: 7.34767309e22,
        velocity: new Vector2(0, 1_022),
    })

    const icons = computed(() => objects.value.map((object) => ({
        src: object.icon,
        position: object.position,
        size: object.size,
    })))
</script>

<template>
    <Map :icons="icons" />
</template>

<style lang="scss" module></style>
