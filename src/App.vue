<script setup lang="ts">
    import Map from './map/Map.vue';
    import SpeedMenu from './menus/speedmenu/SpeedMenu.vue';
    import { useGravitySim } from './sim/sim';
    import Vector2 from './util/Vector2';
    import { computed, ref, useTemplateRef, watch } from 'vue';

    const speedMenu = useTemplateRef("speed-menu")
    const options = computed(() => ({
        speed: speedMenu.value?.speed ?? 0,
    }))

    const { objects, centerOfMass } = useGravitySim(options)

    const history = ref<Vector2[][]>([])

    watch(objects, (newObjects) => {
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

    objects.value.push({
        icon: './icons/earth.svg',
        position: new Vector2(-4_670_000, 0),
        size: 12_742_000,
        mass: 5.972e24,
        velocity: new Vector2(0, -12.5742),
    })

    objects.value.push({
        icon: './icons/moon.svg',
        position: new Vector2(380_784_000, 0),
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
    <Map :icons="icons" :paths="history" :dots="[centerOfMass]" />
    <SpeedMenu ref="speed-menu" />
</template>

<style lang="scss" module>
    body {
        font-family: "Nunito", sans-serif;
        font-size: 18px;
    }
</style>
