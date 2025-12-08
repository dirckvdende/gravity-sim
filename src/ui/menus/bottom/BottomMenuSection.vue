<template>
    <div :class="$style.section">
        <slot />
    </div>
</template>

<style lang="scss" module>
    @use "@/colors.scss";

    .section {
        display: flex;
        align-items: center;
        padding: 0 .4em;
        background-color: var(--bottom-menu-background-color, white);
        border-radius: .5em;
        box-shadow: colors.$menu-shadow;
        user-select: none;
        margin-right: .5em;
        flex-shrink: 0;
    }
</style>