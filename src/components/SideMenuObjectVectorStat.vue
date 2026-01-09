<script lang="ts" setup>
    import { type UnitsList } from '@/util/units';
    import { computed, ref, useTemplateRef } from 'vue';
    import type { SideMenuStatButtonDef } from
    '@/components/SideMenuStatButton.vue';
    import { mdiChartLine, mdiChartMultiline } from '@mdi/js';
    import SideMenuStat from '@/components/SideMenuStat.vue';
    import { storeToRefs } from 'pinia';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import type Vector2 from '@/util/linalg/Vector2';
    import LineGraph from '@/components/LineGraph.vue';
    import LineGraph2D from '@/components/LineGraph2D.vue';

    const {
        value,
        units,
        showLength = false,
        hasGraph = false,
    } = defineProps<{
        /**
         * The value of the stat to display. Displays a placeholder ("—") when
         * undefined. Displays nothing when null
         */
        value?: Vector2 | null
        /** List of units to use to format the values (default no units) */
        units?: UnitsList
        /**
         * Show the length of the vector value next to its name (default false)
         */
        showLength?: boolean
        /**
         * Whether to add a button to display graph(s) of the value evolving
         * over time. Displays a 2D graph if length is not shown and both a 1D
         * and a 2D graph if length is shown (default false)
         */
        hasGraph?: boolean
    }>()

    const graphToggle = ref<"none" | "1D" | "2D">("none")
    const showGraph1D = computed(() => hasGraph && showLength &&
        graphToggle.value == "1D")
    const showGraph2D = computed(() => hasGraph && graphToggle.value == "2D")
    const button1D = computed<SideMenuStatButtonDef | undefined>(() =>
        hasGraph && showLength ? {
            name: "Show length graph",
            active: showGraph1D.value,
            iconPath: mdiChartLine,
            click: () =>
                graphToggle.value = graphToggle.value == "1D" ? "none" : "1D",
        } : undefined)
    const button2D = computed<SideMenuStatButtonDef | undefined>(() =>
        hasGraph ? {
            name: "Show graph",
            active: showGraph2D.value,
            iconPath: mdiChartMultiline,
            click: () =>
                graphToggle.value = graphToggle.value == "2D" ? "none" : "2D",
        } : undefined)
    const buttons = computed(() => {
        const out: SideMenuStatButtonDef[] = []
        for (const button of [button1D, button2D])
            if (button.value)
                out.push(button.value)
        return out
    })

    const { paused } = storeToRefs(useSettingsStore())
    const graph1D = useTemplateRef("graph-1d")
    const graph2D = useTemplateRef("graph-2d")

    /** Clear the graph of the stat */
    function clearGraph(): void {
        graph1D.value?.clear()
        graph2D.value?.clear()
    }

    defineExpose({ clearGraph })
</script>

<template>
    <SideMenuStat :value="showLength ? value?.length() : null" :units="units"
    :buttons="buttons">
        <slot />
    </SideMenuStat>
    <SideMenuStat :value="value?.x" :units="units" :level="1">x</SideMenuStat>
    <SideMenuStat :value="value?.y" :units="units" :level="1">y</SideMenuStat>
    <LineGraph :value="paused ? null : value?.length()"
        ref="graph-1d" v-if="showGraph1D" />
    <LineGraph2D :point="paused ? null : value" draw-point show-axes
        ref="graph-2d" v-if="showGraph2D" />
</template>

<style lang="scss" module></style>