<script lang="ts" setup>
    import { mdiFastForward, mdiRewind, mdiPause, mdiPlay, mdiBullseye } from '@mdi/js';
    import { computed, ref } from 'vue';
    import { useKeyEvent } from '../util/keyEvent';
    import MenuSection from './templates/MenuSection.vue';
    import MenuButton from './templates/MenuButton.vue';
    import MenuText from './templates/MenuText.vue';
    import BottomMenu from './templates/BottomMenu.vue';
    import { useOptionsStore } from '@/stores/options';
    import { storeToRefs } from 'pinia';

    const { speed, showBarycenter } = storeToRefs(useOptionsStore())

    type Mode = {
        name: string,
        speed: number,
    }

    const modes: Mode[] = [
        { name: "1 second / s", speed: 1 },
        { name: "1 minute / s", speed: 60 },
        { name: "1 hour / s", speed: 60 * 60 },
        { name: "1 day / s", speed: 60 * 60 * 24 },
        { name: "1 week / s", speed: 60 * 60 * 24 * 7 },
        { name: "1 month / s", speed: 60 * 60 * 24 * 365.25 / 12 },
        { name: "1 year / s", speed: 60 * 60 * 24 * 365.25 },
    ]
    
    const paused = ref(false)
    const index = ref(0)
    
    const name = computed(() => {
        if (paused.value)
            return "Paused"
        return modes[index.value]?.name ?? "Paused"
    })

    function updateSpeed() {
        speed.value = paused.value ? 0 : (modes[index.value]?.speed ?? 0)
    }

    function pause() {
        paused.value = !paused.value
        updateSpeed()
    }

    function slowDown() {
        paused.value = false
        index.value = Math.max(0, index.value - 1)
        updateSpeed()
    }

    function speedUp() {
        paused.value = false
        index.value = Math.min(modes.length - 1, index.value + 1)
        updateSpeed()
    }
    
    useKeyEvent(" ", pause)
    useKeyEvent("[", slowDown)
    useKeyEvent("]", speedUp)

    function toggleBarycenter() {
        showBarycenter.value = !showBarycenter.value
    }
</script>

<template>
    <BottomMenu>
        <MenuSection>
            <MenuButton
                :icon="paused ? mdiPlay : mdiPause"
                @click="pause"
                :style="{
                    '--icon-color': paused ? '#6b8edf' : '#e16262',
                }">{{ paused ? "Play (_)" : "Pause (_)" }}</MenuButton>
            <MenuButton
                :icon="mdiRewind"
                @click="slowDown">Slower ([)</MenuButton>
            <MenuText>{{ name }}</MenuText>
            <MenuButton
                :icon="mdiFastForward"
                @click="speedUp">Faster (])</MenuButton>
        </MenuSection>
        <MenuSection>
            <MenuButton
                :icon="mdiBullseye"
                @click="toggleBarycenter"
                :style="{
                    '--icon-color': showBarycenter ? '#9f30b3' : undefined,
                }">Barycenter</MenuButton>
        </MenuSection>
    </BottomMenu>
</template>

<style lang="scss" module>
    .menu {
        position: fixed;
        bottom: .6em;
        left: .6em;
        display: flex;
        align-items: center;
        padding: 0 .4em;
        background-color: white;
        border-radius: .5em;
        box-shadow: 0 .15em .6em -.4em black;
        user-select: none;

        .speed-button {
            background-color: transparent;
            border: none;
            cursor: pointer;

            .icon {
                width: 2em;
                height: 2em;
                fill: #999;
            }

            &:hover .icon {
                fill: #555;
            }
        }

        .pause-button .icon {
            fill: #e16262;

            &:hover {
                fill: #9d3131;
            }
        }
        
        .pause-button.paused .icon {
            fill: #6b8edf;

            &:hover {
                fill: #4065bb;
            }
        }

        .speed-text {
            width: 7em;
            text-align: center;
            font-size: .9em;
            font-weight: 500;
        }
    }
</style>