<script setup lang="ts">
    import Map from './oldmap/Map.vue';
    import Vector2 from './util/Vector2';
    import { computed, ref, watch } from 'vue';
    import BottomSettings from './ui/BottomSettings.vue';
    import { useOptionsStore } from './oldstores/options';
    import { storeToRefs } from 'pinia';
    import type { RenderedIcon } from './oldmap/icons/IconRenderer.vue';
    import PathRenderer from './oldmap/PathRenderer.vue';
    import GridRenderer from './oldmap/GridRenderer.vue';
    import IconRenderer from './oldmap/icons/IconRenderer.vue';
    import Ruler from './ui/Ruler.vue';
    import { useSimStore } from './oldstores/sim';
    import GlobalMapSync from './oldstores/GlobalMapSync.vue';
    import TimeDisplay from './ui/TimeDisplay.vue';
    import DemoOverlay from './ui/DemoOverlay.vue';
    import LoadMenu from './ui/LoadMenu.vue';
import UIContainer from './ui/UIContainer.vue';

    const {
        showBarycenter,
        showOrbits,
        showGrid,
    } = storeToRefs(useOptionsStore())
    const { objects, barycenter, timestamp } = storeToRefs(useSimStore())

    const history = ref<Vector2[][]>([])

    watch(objects, (newObjects) => {
        if (!showOrbits.value) {
            history.value = []
            return
        }
        while (history.value.length < newObjects.length)
            history.value.push([])
        for (const [index, object] of newObjects.entries()) {
            if (history.value[index] == undefined)
                continue
            history.value[index].push(object.position)
            if (history.value[index].length > 1000)
                history.value[index].splice(0, 1)
        }
    })

    const NORMALIZE_FACTOR = 1 / 6.6743e-20

    timestamp.value = new Date("2013-1-1 0:00:00 UTC")
    // Pluto
    objects.value.push({
        icon: './icons/pluto.svg',
        position: new Vector2(2.12703919e+06, -3.08210900e-12),
        size: 2_376_600,
        mass: 869.3 * NORMALIZE_FACTOR,
        velocity: new Vector2(-2.83643439e-03,  2.42173886e+01),
    })
    // Charon
    objects.value.push({
        icon: './icons/charon.svg',
        position: new Vector2(-1.74691048e+07, -1.48438086e+03),
        size: 1_212_000,
        mass: 106.1 * NORMALIZE_FACTOR,
        velocity: new Vector2(2.59407652e-02, -1.98897004e+02),
    })
    // Nix
    objects.value.push({
        icon: './icons/nix.svg',
        position: new Vector2(-4.83354857e+07, -7.42254914e+06),
        size: 50_000,
        mass: 1.50e-3 * NORMALIZE_FACTOR,
        velocity: new Vector2(2.06564133e+01, -1.39465804e+02),
    })
    // Hydra
    objects.value.push({
        icon: './icons/hydra.svg',
        position: new Vector2(32554655.74929921, 56051327.32152872),
        size: 50_900,
        mass: 2.01e-3 * NORMALIZE_FACTOR,
        velocity: new Vector2(-106.01932065, 62.51678508),
    })
    // Kerberos
    objects.value.push({
        icon: './icons/kerberos.svg',
        position: new Vector2(-51255243.15214943, -26846953.65410998),
        size: 19_000,
        mass: 1e-5 * NORMALIZE_FACTOR, // (very low mass)
        velocity: new Vector2(60.15678687, -115.36690241),
    })
    // Styx
    objects.value.push({
        icon: './icons/styx.svg',
        position: new Vector2(-4022208.59039472, 42121539.42213004),
        size: 16_000,
        mass: 1e-5 * NORMALIZE_FACTOR, // (very low mass)
        velocity: new Vector2(-153.58637481, -15.71068336),
    })

    // objects.value.push({
    //     icon: './icons/earth.svg',
    //     position: new Vector2(-4_670_000, 0),
    //     size: 12_742_000,
    //     mass: 5.972e24,
    //     velocity: new Vector2(0, -12.5742),
    // })

    // objects.value.push({
    //     icon: './icons/moon.svg',
    //     position: new Vector2(380_784_000, 0),
    //     size: 3_474_800,
    //     mass: 7.34767309e22,
    //     velocity: new Vector2(0, 1_022),
    // })

    const icons = computed(() => {
        const out: RenderedIcon[] = objects.value.map((object) => ({
            src: object.icon,
            position: object.position,
            size: object.size,
        }))
        if (showBarycenter.value)
            out.push({
                src: "./icons/barycenter.svg",
                position: barycenter.value,
                size: 20,
                ignoreScaling: true,
            })
        return out
    })
</script>

<template>
    <Map v-slot="{ tracker }">
        <GridRenderer
            v-if="showGrid"
            :tracker="tracker" />
        <PathRenderer
            v-if="showOrbits"
            v-for="path in history"
            :tracker="tracker"
            :points="path" />
        <IconRenderer
            :tracker="tracker"
            :icons="icons" />
        <Ruler :tracker="tracker" />
        <GlobalMapSync :tracker="tracker" />
    </Map>
    <UIContainer>
        <BottomSettings ref="bottom-settings" />
        <TimeDisplay />
        <LoadMenu />
    </UIContainer>
    <DemoOverlay />
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