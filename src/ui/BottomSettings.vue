<script lang="ts" setup>
    import { mdiFastForward, mdiRewind, mdiPause, mdiPlay, mdiBullseye,
    mdiTarget, 
    mdiOrbit,
    mdiWeatherNight} from '@mdi/js';
    import { computed } from 'vue';
    import { useKeyEvent } from '../util/keyEvent';
    import MenuSection from './templates/MenuSection.vue';
    import MenuButton from './templates/MenuButton.vue';
    import MenuText from './templates/MenuText.vue';
    import BottomMenu from './templates/BottomMenu.vue';
    import { useOptionsStore } from '@/stores/options';
    import { storeToRefs } from 'pinia';
    import { useSimOptionsStore, useSimStore } from '@/stores/sim';

    const {
        showBarycenter,
        showOrbits,
        darkMode,
    } = storeToRefs(useOptionsStore())
    const { speed, paused } = storeToRefs(useSimOptionsStore())

    type Mode = {
        name: string,
        speed: number,
    }

    const modes = [
        { name: "1 second / s", speed: 1 },
        { name: "1 minute / s", speed: 60 },
        { name: "1 hour / s", speed: 60 * 60 },
        { name: "1 day / s", speed: 60 * 60 * 24 },
        { name: "1 week / s", speed: 60 * 60 * 24 * 7 },
        { name: "1 month / s", speed: 60 * 60 * 24 * 365.25 / 12 },
        { name: "1 year / s", speed: 60 * 60 * 24 * 365.25 },
    ] as const

    // Pair of [index, mode]
    const mode = computed(() => {
        let closestDiff = Infinity
        let closest: [number, Mode] = [0, modes[0]]
        for (const [index, mode] of modes.entries()) {
            if (Math.abs(speed.value - mode.speed) < closestDiff) {
                closestDiff = Math.abs(speed.value - mode.speed)
                closest = [index, mode]
            }
        }
        return closest
    })

    function pause() {
        paused.value = !paused.value
    }

    function speedUp() {
        const nextMode = modes[mode.value[0] + 1]
        if (nextMode != undefined)
            speed.value = nextMode.speed
    }

    function slowDown() {
        const prevMode = modes[mode.value[0] - 1]
        if (prevMode != undefined)
            speed.value = prevMode.speed
    }

    useKeyEvent(" ", pause)
    useKeyEvent("[", slowDown)
    useKeyEvent("]", speedUp)

    function toggleBarycenter() {
        showBarycenter.value = !showBarycenter.value
    }

    function resetToBarycenter() {
        useSimStore().resetToBarycenter()
    }

    useKeyEvent("B", toggleBarycenter, { caseInsensitive: true })
    useKeyEvent("R", resetToBarycenter, { caseInsensitive: true })

    function toggleOrbits() {
        showOrbits.value = !showOrbits.value
    }

    useKeyEvent("O", toggleOrbits, { caseInsensitive: true })

    function toggleDarkMode() {
        darkMode.value = !darkMode.value
    }
</script>

<template>
    <BottomMenu>
        <MenuSection>
            <MenuButton
                :icon="paused ? mdiPlay : mdiPause"
                @click="pause"
                :style="{
                    '--icon-color': paused ? 'var(--accent-color-blue, #6b8edf)'
                    : 'var(--accent-color-red, #e16262)',
                }">{{ paused ? "Play (_)" : "Pause (_)" }}</MenuButton>
            <MenuButton
                :icon="mdiRewind"
                @click="slowDown">Slower ([)</MenuButton>
            <MenuText>{{ mode[1].name }}</MenuText>
            <MenuButton
                :icon="mdiFastForward"
                @click="speedUp">Faster (])</MenuButton>
        </MenuSection>
        <MenuSection>
            <MenuButton
                :icon="mdiBullseye"
                @click="toggleBarycenter"
                :style="{
                    '--icon-color': showBarycenter ?
                    'var(--accent-color-purple, #9f30b3)' : undefined,
                }">Show barycenter (B)</MenuButton>
            <MenuButton
                :icon="mdiTarget"
                @click="resetToBarycenter"
            >Reset to barycenter (R)</MenuButton>
        </MenuSection>
        <MenuSection>
            <MenuButton
                :icon="mdiOrbit"
                @click="toggleOrbits"
                :style="{
                    '--icon-color': showOrbits ?
                    'var(--accent-color-blue, #6b8edf)' : undefined,
                }">Show orbits (O)</MenuButton>
            <MenuButton
                :icon="mdiWeatherNight"
                @click="toggleDarkMode"
                :style="{
                    '--icon-color': darkMode ?
                    'var(--accent-color-blue, #6b8edf)' : undefined,
                }">Dark mode</MenuButton>
        </MenuSection>
    </BottomMenu>
</template>