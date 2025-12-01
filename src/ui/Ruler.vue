<script lang="ts" setup>
    import type { PositionRectTracker } from '@/map/positionRectTracker';
    import Vector2 from '@/util/Vector2';
    import { computed } from 'vue';

    const { tracker } = defineProps<{
        /** Tracker used to display the map */
        tracker: PositionRectTracker,
    }>()

    // Space left at the sides of the arrow
    const SIDE_SPACE = 5
    // Height of the arrow SVG
    const HEIGHT = 12
    // Line width of the arrow
    const LINE_WIDTH = 2
    // Minimum arrow width in pixels
    const MIN_ARROW_WIDTH = 70
    
    // Units of length with their lengths in meters. Should be sorted by size in
    // ascending order!
    const LENGTH_UNITS: { name: string, meters: number }[] = [
        { name: "pm", meters: 1e-12 },
        { name: "nm", meters: 1e-9 },
        { name: "μm", meters: 1e-6 },
        { name: "mm", meters: 1e-3 },
        { name: "cm", meters: 1e-2 },
        { name: "m", meters: 1 },
        { name: "km", meters: 1000 },
        { name: "ly", meters: 9.461e15 },
    ]

    /**
     * Get the best unit to display a given length in
     * @param meters Length in meters to express
     * @returns The unit name and its length in meters. This is the largest unit
     * that doesn't exceed the given length, or the smallest unit if this is not
     * possible
     */
    function bestUnit(meters: number): { name: string, meters: number } {
        let i = 0
        while (i + 1 < LENGTH_UNITS.length && LENGTH_UNITS[i + 1]!.meters <=
        meters)
            i++
        return LENGTH_UNITS[i]!
    }

    function smallestNiceMultiple(min: number): {
        multiple: number,
        exponent: number,
        value: number
    } {
        let exponent = Math.floor(Math.log10(min))
        let multiple = 1
        while (multiple * Math.pow(10, exponent) < min) {
            if (multiple == 1) {
                multiple = 2
            } else if (multiple == 2) {
                multiple = 5
            } else {
                exponent++
                multiple = 1
            }
        }
        return {
            multiple,
            exponent,
            value: multiple * Math.pow(10, exponent),
        }
    }

    /**
     * Reverse a string
     * @param str The string to reverse
     * @returns The reversed string
     */
    function reverseString(str: string): string {
        return str.split("").reverse().join("")
    }

    /**
     * Add spaces at a given interval, counting from the back (unless
     * startAtFront is true). This can for example be used for thousand
     * separators
     * @param str The string to add spaces to
     * @param n The length of each interval that is separated by a space
     * @param startAtFront Whether to start at the front, meaning an interval
     * at the end may be cut off
     * @returns The string with inserted spaces
     */
    function spaceInterval(str: string, n: number = 3, startAtFront: boolean =
    false): string {
        if (!startAtFront)
            return reverseString(spaceInterval(reverseString(str), n, true))
        let out = ""
        for (let i = 0; i < str.length; i += n) {
            if (i != 0)
                out += " "
            out += str.substring(i, i + n)
        }
        return out
    }

    // Unit to display
    const unit = computed(() =>
        bestUnit(MIN_ARROW_WIDTH * tracker.pixelSize.value))
    // Size of a pixel in the displayed units
    const unitPixelSize = computed(() =>
        tracker.pixelSize.value / unit.value.meters)
    // Length of the arrow in displayed units, separated into multiple and
    // exponent (log10)
    const unitLength = computed(() =>
        smallestNiceMultiple(unitPixelSize.value * MIN_ARROW_WIDTH))
    // Length of the arrow in pixels
    const pixelLength = computed(() =>
        unitLength.value.value / unitPixelSize.value)

    // Label to display as HTML (!)
    const label = computed(() => {
        const { multiple, exponent } = unitLength.value
        const unitName = unit.value.name
        const m = multiple == 1 ? "" : `${multiple} × `
        if (exponent < -3)
            return `${m}10<sup>${exponent}</sup> ${unitName}`
        if (exponent < 0) {
            const str = '0'.repeat(-exponent - 1) + `${multiple}`
            return "0." + spaceInterval(str, 3, true) + ` ${unitName}`
        }
        if (exponent < 6) {
            const str = `${multiple}` + '0'.repeat(exponent)
            return spaceInterval(str, 3, false) + ` ${unitName}`
        }
        return `${m}10<sup>${exponent}</sup> ${unitName}`
    })

    // SVG path of the arrow
    const path = computed(() => {
        const diff = new Vector2(
            HEIGHT / 2 - LINE_WIDTH,
            HEIGHT / 2 - LINE_WIDTH,
        )
        return `
            M 0 ${HEIGHT / 2}
            l ${diff.x} ${diff.y}
            m ${-diff.x} ${-diff.y}
            l ${diff.x} ${-diff.y}
            m ${-diff.x} ${diff.y}
            L ${pixelLength.value} ${HEIGHT / 2}
            z
            M ${pixelLength.value} ${HEIGHT / 2}
            l ${-diff.x} ${diff.y}
            m ${diff.x} ${-diff.y}
            l ${-diff.x} ${-diff.y}
            m ${diff.x} ${diff.y}
        `
    })
    // Dimensions of the arrow SVG
    const dimensions = computed(() =>
        new Vector2(pixelLength.value + SIDE_SPACE * 2, HEIGHT))
    // ViewBox of the arrow SVG
    const viewBox = computed(() =>
        `-${SIDE_SPACE} 0 ${dimensions.value.x} ${dimensions.value.y}`)
</script>

<template>
    <div :class="$style.container">
        <div :class="$style.label" v-html="label" />
        <svg :class="$style.arrow" :width="dimensions.x" :height="dimensions.y"
        :viewBox="viewBox" :style="{
            strokeWidth: LINE_WIDTH
        }">
            <path :d="path" />
        </svg>
    </div>
</template>

<style lang="scss" module>
    .container {
        position: fixed;
        bottom: calc(3.2em + env(safe-area-inset-bottom, 0px));
        left: .5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;
        pointer-events: none;

        .label {
            font-size: .7em;
            color: var(--ruler-color, #333);
            margin-bottom: -.2em;
            font-weight: bold;
        }

        .arrow {
            stroke: var(--ruler-color, #333);
            stroke-linecap: round;
            fill: none;
        }
    }
</style>