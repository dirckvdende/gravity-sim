<template>
    <div :class="$style.text">
        <slot />
    </div>
</template>

<style lang="scss" module>
    .text {
        width: 7em;
        text-align: center;
        font-size: .9em;
        font-weight: 600;
    }
</style>