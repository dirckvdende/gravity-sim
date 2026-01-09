<script lang="ts" setup>
    import { type UnitsList } from '@/util/units';
    import { computed, ref, useTemplateRef } from 'vue';
    import type { SideMenuStatButtonDef } from '@/components/SideMenuStatButton.vue';
    import { mdiChartLine } from '@mdi/js';
    import SideMenuStat from '@/components/SideMenuStat.vue';
    import { storeToRefs } from 'pinia';
    import { useSettingsStore } from '@/stores/useSettingsStore';
    import LineGraph from '@/components/LineGraph.vue';

    const {
        value,
        units,
        hasGraph = false,
    } = defineProps<{
        /**
         * The value of the stat to display. Displays a placeholder ("—") when
         * undefined. Displays nothing when null. Displays the literal string in
         * case of a string
         */
        value?: number | string | null
        /** List of units to use to format the value (default no units) */
        units?: UnitsList
        /**
         * Whether to add a button to display a graph of the value evolving
         * over time (default false)
         */
        hasGraph?: boolean
    }>()

    const graphToggle = ref(false)
    const showGraph = computed(() => hasGraph && graphToggle.value)
    const buttons = computed<SideMenuStatButtonDef[]>(() => hasGraph ? [{
        name: "Show graph",
        active: showGraph.value,
        iconPath: mdiChartLine,
        click: () => graphToggle.value = !graphToggle.value,
    }] : [])

    const { paused } = storeToRefs(useSettingsStore())
    const graph = useTemplateRef("graph")

    /** Clear the graph of the stat */
    function clearGraph(): void {
        graph.value?.clear()
    }

    defineExpose({ clearGraph })
</script>

<template>
    <SideMenuStat :value="value" :units="units" :buttons="buttons">
        <slot />
    </SideMenuStat>
    <LineGraph
        v-if="(showGraph && typeof value != 'string')"
        ref="graph"
        :value="paused ? null : value" />
</template>

<style lang="scss" module></style>