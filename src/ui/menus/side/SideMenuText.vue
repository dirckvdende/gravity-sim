<template>
    <div :class="$style.text">
        <slot />
    </div>
</template>

<style lang="scss" module>
    .text {
        width: 100%;
        box-sizing: border-box;
        padding: 0 1em;
        text-align: center;
        font-weight: 800;
        font-size: .9em;
        color: var(--side-menu-icon-color);
    }
</style>