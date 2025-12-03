<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import GravityMap from './gravitymap/GravityMap.vue';
    import { useGravitySimStore } from './stores/useGravitySimStore';
    import Vector2 from './util/Vector2';

    const NORMALIZE_FACTOR = 1 / 6.6743e-20

    const { timestamp, objects } = storeToRefs(useGravitySimStore())

    timestamp.value = new Date("2013-1-1 0:00:00 UTC")
    // Pluto
    objects.value.push({
        id: 0,
        position: new Vector2(2.12703919e+06, -3.08210900e-12),
        mass: 869.3 * NORMALIZE_FACTOR,
        velocity: new Vector2(-2.83643439e-03,  2.42173886e+01),
    })
    // Charon
    objects.value.push({
        id: 1,
        position: new Vector2(-1.74691048e+07, -1.48438086e+03),
        mass: 106.1 * NORMALIZE_FACTOR,
        velocity: new Vector2(2.59407652e-02, -1.98897004e+02),
    })
    // Nix
    objects.value.push({
        id: 2,
        position: new Vector2(-4.83354857e+07, -7.42254914e+06),
        mass: 1.50e-3 * NORMALIZE_FACTOR,
        velocity: new Vector2(2.06564133e+01, -1.39465804e+02),
    })
    // Hydra
    objects.value.push({
        id: 3,
        position: new Vector2(32554655.74929921, 56051327.32152872),
        mass: 2.01e-3 * NORMALIZE_FACTOR,
        velocity: new Vector2(-106.01932065, 62.51678508),
    })
    // Kerberos
    objects.value.push({
        id: 4,
        position: new Vector2(-51255243.15214943, -26846953.65410998),
        mass: 1e-5 * NORMALIZE_FACTOR, // (very low mass)
        velocity: new Vector2(60.15678687, -115.36690241),
    })
    // Styx
    objects.value.push({
        id: 5,
        position: new Vector2(-4022208.59039472, 42121539.42213004),
        mass: 1e-5 * NORMALIZE_FACTOR, // (very low mass)
        velocity: new Vector2(-153.58637481, -15.71068336),
    })
</script>

<template>
    <GravityMap />
</template>

<style lang="scss" module>
</style>