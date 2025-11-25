<script lang="ts" setup>
    import { mdiFastForward, mdiRewind, mdiPause, mdiPlay } from '@mdi/js';
    import SVGIcon from '../SVGIcon.vue';
    import { computed, ref } from 'vue';

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
    const speed = computed(() => {
        if (paused.value)
            return 0
        return modes[index.value]?.speed ?? 0
    })

    function pause() { paused.value = !paused.value }
    function slowDown() { index.value = Math.max(0, index.value - 1) }
    function speedUp() {
        index.value = Math.min(modes.length - 1, index.value + 1)
    }

    defineExpose({ speed })
</script>

<template>
    <div :class="$style.menu">
        <button :class="$style['speed-button']" @click="pause">
            <SVGIcon :path="paused ? mdiPlay : mdiPause" :class="$style.icon" />
        </button>
        <button :class="$style['speed-button']" @click="slowDown">
            <SVGIcon :path="mdiRewind" :class="$style.icon" />
        </button>
        <div :class="$style['speed-text']">{{ name }}</div>
        <button :class="$style['speed-button']" @click="speedUp">
            <SVGIcon :path="mdiFastForward" :class="$style.icon" />
        </button>
    </div>
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
        box-shadow: 0 .2em .4em -.3em black;
        user-select: none;

        .speed-button {
            background-color: transparent;
            border: none;
            cursor: pointer;

            &:hover {
                background-color: #0001;
            }

            .icon {
                width: 2em;
                height: 2em;
                fill: grey;
            }
        }

        .speed-text {
            width: 6em;
            text-align: center;
        }
    }
</style>