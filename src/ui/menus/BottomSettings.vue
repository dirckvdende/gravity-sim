<script lang="ts" setup>
    import { mdiFastForward, mdiRewind, mdiPause, mdiPlay, mdiBullseye,
    mdiTarget, mdiOrbit, mdiWeatherNight, mdiGrid, mdiContentSaveOutline,
    mdiFullscreen, mdiFolderOpenOutline} from '@mdi/js';
    import { computed } from 'vue';
    import { useKeyEvent } from '../../util/keyEvent';
    import BottomMenu from './bottom/BottomMenu.vue';
    import BottomMenuButton from './bottom/BottomMenuButton.vue';
    import BottomMenuSection from './bottom/BottomMenuSection.vue';
    import BottomMenuText from './bottom/BottomMenuText.vue';
    import { storeToRefs } from 'pinia';
    import { toggleFullscreen, isFullscreenRef } from '@/util/fullscreen';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import { useGravitySimStore } from '@/stores/useGravitySimStore';
    import { useMenuStore } from '@/stores/useMenuStore';
    import { useGravityMapStore } from '@/stores/useGravityMapStore';
    import Vector2 from '@/util/Vector2';
    import { useOrbitHistoryStore } from '@/stores/useOrbitHistoryStore';
    import { getState } from '@/filesystem/state.mjs';
    import { saveToFile } from '@/filesystem/save.mjs';

    const {
        showBarycenter,
        showOrbits,
        darkMode,
        showGrid,
    } = storeToRefs(useSettingsStore())
    const { speed, paused } = storeToRefs(useSettingsStore())
    const { slowed } = storeToRefs(useGravitySimStore())

    type Mode = {
        name: string,
        speed: number,
    }

    const modes = [
        { name: "-1 year / s", speed: -60 * 60 * 24 * 365.25 },
        { name: "-1 month / s", speed: -60 * 60 * 24 * 365.25 / 12 },
        { name: "-1 week / s", speed: -60 * 60 * 24 * 7 },
        { name: "-1 day / s", speed: -60 * 60 * 24 },
        { name: "-1 hour / s", speed: -60 * 60 },
        { name: "-1 minute / s", speed: -60 },
        { name: "-1 second / s", speed: -1 },
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

    useKeyEvent(" ", pause, { preventDefault: true })
    useKeyEvent("[", slowDown)
    useKeyEvent("]", speedUp)

    function toggleBarycenter() {
        showBarycenter.value = !showBarycenter.value
    }

    function resetToBarycenter() {
        useGravitySimStore().resetToBarycenter()
        useGravityMapStore().position = Vector2.Zero
        useOrbitHistoryStore().clearOrbits()
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

    function toggleGrid() {
        showGrid.value = !showGrid.value
    }

    function saveFile() {
        saveToFile(getState())
    }

    const { activeMenu } = storeToRefs(useMenuStore())

    function loadFile() {
        activeMenu.value = "load"
    }
</script>

<template>
    <BottomMenu class="ignore-side-menu-close">
        <BottomMenuSection>
            <BottomMenuButton
                :path-icon="paused ? mdiPlay : mdiPause"
                @click="pause"
                :style="{
                    '--icon-color': paused ? 'var(--accent-color-blue, #6b8edf)'
                    : 'var(--accent-color-red, #e16262)',
                }">{{ paused ? "Play (_)" : "Pause (_)" }}</BottomMenuButton>
            <BottomMenuButton
                :path-icon="mdiRewind"
                @click="slowDown">Slower ([)</BottomMenuButton>
            <BottomMenuText :style="{
                color: slowed ? 'var(--accent-color-orange)' : undefined,
            }">{{ mode[1].name }}{{ slowed ? " *" : "" }}</BottomMenuText>
            <BottomMenuButton
                :path-icon="mdiFastForward"
                @click="speedUp">Faster (])</BottomMenuButton>
        </BottomMenuSection>
        <BottomMenuSection>
            <BottomMenuButton
                :path-icon="mdiBullseye"
                @click="toggleBarycenter"
                :style="{
                    '--icon-color': showBarycenter ?
                    'var(--accent-color-purple, #9f30b3)' : undefined,
                }">Show barycenter (B)</BottomMenuButton>
            <BottomMenuButton
                :path-icon="mdiTarget"
                @click="resetToBarycenter"
            >Reset to barycenter (R)</BottomMenuButton>
        </BottomMenuSection>
        <BottomMenuSection>
            <BottomMenuButton
                :path-icon="mdiOrbit"
                @click="toggleOrbits"
                :style="{
                    '--icon-color': showOrbits ?
                    'var(--accent-color-blue, #6b8edf)' : undefined,
                }">Show orbits (O)</BottomMenuButton>
            <BottomMenuButton
                :path-icon="mdiGrid"
                @click="toggleGrid"
                :style="{
                    '--icon-color': showGrid ?
                    'var(--accent-color-blue, #6b8edf)' : undefined,
                }">Show grid</BottomMenuButton>
            <BottomMenuButton
                :path-icon="mdiWeatherNight"
                @click="toggleDarkMode"
                :style="{
                    '--icon-color': darkMode ?
                    'var(--accent-color-blue, #6b8edf)' : undefined,
                }">Dark mode</BottomMenuButton>
            <BottomMenuButton
                :path-icon="mdiFullscreen"
                @click="() => toggleFullscreen()"
                :style="{
                    '--icon-color': isFullscreenRef ?
                    'var(--accent-color-blue, #6b8edf)' : undefined,
                }">Full screen</BottomMenuButton>
        </BottomMenuSection>
        <BottomMenuSection>
            <BottomMenuButton
                :path-icon="mdiContentSaveOutline"
                @click="saveFile"
                >Save file</BottomMenuButton>
            <BottomMenuButton
                :path-icon="mdiFolderOpenOutline"
                @click="loadFile"
                >Load file</BottomMenuButton>
        </BottomMenuSection>
    </BottomMenu>
</template>