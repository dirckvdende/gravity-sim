<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import GravityMap from './gravitymap/GravityMap.vue';
    import Vector2 from './util/linalg/Vector2';
    import { useGravitySimStore } from './stores/useGravitySimStore';
    import UI from './ui/UI.vue';
    import { useGravityMapStore } from './stores/useGravityMapStore';
    import { useExitWarning } from './util/useExitWarning';

    const NORMALIZE_FACTOR = 1 / 6.6743e-20

    const { timestamp, objects } = storeToRefs(useGravitySimStore())
    const { zoomLevel } = storeToRefs(useGravityMapStore())

    if (import.meta.env.VITE_EXIT_WARNING !== "false")
        useExitWarning()

    // timestamp.value = new Date("2013-1-1 0:00:00 UTC")
    // // Pluto
    // objects.value.push({
    //     id: 0,
    //     position: new Vector2(2.12703919e+06, -3.08210900e-12),
    //     mass: 869.3 * NORMALIZE_FACTOR,
    //     velocity: new Vector2(-2.83643439e-03,  2.42173886e+01),
    //     icon: "./icons/pluto.svg",
    //     size: 2_376_600,
    //     name: "Pluto",
    // })
    // // Charon
    // objects.value.push({
    //     id: 1,
    //     position: new Vector2(-1.74691048e+07, -1.48438086e+03),
    //     mass: 106.1 * NORMALIZE_FACTOR,
    //     velocity: new Vector2(2.59407652e-02, -1.98897004e+02),
    //     icon: "./icons/charon.svg",
    //     size: 1_212_000,
    //     name: "Charon",
    // })
    // // Nix
    // objects.value.push({
    //     id: 2,
    //     position: new Vector2(-4.83354857e+07, -7.42254914e+06),
    //     mass: 1.50e-3 * NORMALIZE_FACTOR,
    //     velocity: new Vector2(2.06564133e+01, -1.39465804e+02),
    //     icon: "./icons/nix.svg",
    //     size: 50_000,
    //     name: "Nix",
    // })
    // // Hydra
    // objects.value.push({
    //     id: 3,
    //     position: new Vector2(32554655.74929921, 56051327.32152872),
    //     mass: 2.01e-3 * NORMALIZE_FACTOR,
    //     velocity: new Vector2(-106.01932065, 62.51678508),
    //     icon: "./icons/hydra.svg",
    //     size: 50_900,
    //     name: "Hydra",
    // })
    // // Kerberos
    // objects.value.push({
    //     id: 4,
    //     position: new Vector2(-51255243.15214943, -26846953.65410998),
    //     mass: 1e-5 * NORMALIZE_FACTOR, // (very low mass)
    //     velocity: new Vector2(60.15678687, -115.36690241),
    //     icon: "./icons/kerberos.svg",
    //     size: 19_000,
    //     name: "Kerberos",
    // })
    // // Styx
    // objects.value.push({
    //     id: 5,
    //     position: new Vector2(-4022208.59039472, 42121539.42213004),
    //     mass: 1e-5 * NORMALIZE_FACTOR, // (very low mass)
    //     velocity: new Vector2(-153.58637481, -15.71068336),
    //     icon: "./icons/styx.svg",
    //     size: 16_000,
    //     name: "Styx",
    // })

    // objects.value.push({
    //     id: 0,
    //     position: new Vector2(-4_670_000, 0),
    //     mass: 5.972e24,
    //     velocity: new Vector2(0, -12.5742),
    //     icon: "./icons/earth.svg",
    //     size: 12_742_000,
    //     name: "Earth"
    // })

    // objects.value.push({
    //     id: 1,
    //     position: new Vector2(380_784_000, 0),
    //     mass: 7.34767309e22,
    //     velocity: new Vector2(0, 1_022),
    //     icon: "./icons/moon.svg",
    //     size: 3_474_800,
    //     name: "Moon",
    // })

    zoomLevel.value = -22
    timestamp.value = new Date("2025-12-4 0:00:00 UTC")
    objects.value.push({
        id: 0,
        mass: 6.4171e+23,
        position: new Vector2(219331860751.8892, -3.07482006171276e-06),
        velocity: new Vector2(-2161.201612056362, 25071.162096161017),
        icon: "./icons/mars.svg",
        size: 6_779_000,
        name: "Mars",
        description: "",
    })
    objects.value.push({
        id: 1,
        mass: 1.98841e+30,
        position: new Vector2(848634613.9098889, -451849082.26611096),
        velocity: new Vector2(-0.4097221427660388, 12.55523946105921),
        icon: "./icons/sun.svg",
        size: 1_392_700_000,
        name: "Sol",
        description: "",
    })
    objects.value.push({
        id: 2,
        mass: 5.97219e+24,
        position: new Vector2(-141081000038.2215, 39474087820.45221),
        velocity: new Vector2(-7915.160638621885, -29123.98240226964),
        icon: "./icons/earth.svg",
        size: 12_742_000,
        name: "Earth",
        description: "Our home!",
    })
    objects.value.push({
        id: 3,
        mass: 3.302e+23,
        position: new Vector2(-29834537827.31945, -40455481011.01213),
        velocity: new Vector2(37103.64877771851, -39634.69322681381),
        icon: "./icons/mercury.svg",
        size: 4_879_400,
        name: "Mercury",
        description: "",
    })
    objects.value.push({
        id: 4,
        mass: 4.8685e+24,
        position: new Vector2(89656347232.53941, -62434220202.28404),
        velocity: new Vector2(20223.571925826516, 28534.252011848803),
        icon: "./icons/venus.svg",
        size: 12_104_000,
        name: "Venus",
        description: "",
    })
    objects.value.push({
        id: 5,
        mass: 1.89819e+27,
        position: new Vector2(-733770320394.0323, -256510379204.82162),
        velocity: new Vector2(3697.9630469766134, -12519.091774373986),
        icon: "./icons/jupiter.svg",
        size: 139_820_000,
        name: "Jupiter",
        description: "",
    })
    objects.value.push({
        id: 6,
        mass: 5.6834e+26,
        position: new Vector2(-77507984011.84268, 1422304621904.8862),
        velocity: new Vector2(-9594.914243919056, -1057.6776389139093),
        icon: "./icons/saturn.svg",
        size: 120_536_000,
        name: "Saturn",
        description: "",
    })
    objects.value.push({
        id: 7,
        mass: 8.6813e+25,
        position: new Vector2(-2568876601491.96, 1378270461947.779),
        velocity: new Vector2(-2899.158837100163, -6037.676866393813),
        icon: "./icons/uranus.svg",
        size: 51_118_000,
        name: "Uranus",
        description: "",
    })
    objects.value.push({
        id: 8,
        mass: 1.02409e+26,
        position: new Vector2(-263078058929.1874, 4462502936784.5205),
        velocity: new Vector2(-5452.886561546886, -356.19481326340053),
        icon: "./icons/neptune.svg",
        size: 49_244_000,
        name: "Neptune",
        description: "",
    })
</script>

<template>
    <GravityMap />
    <UI />
</template>

<style lang="scss" module>
    body {
        font-family: "Nunito", sans-serif;
        font-size: 18px;
        font-weight: 500;
        background-color: var(--background-color, white);
    }

    button {
        font-family: inherit;
        font-weight: inherit;
        color: inherit;
    }

    * {
        -webkit-tap-highlight-color: transparent;
    }
</style>

<style lang="scss">
    @use "./colors.scss";
</style>