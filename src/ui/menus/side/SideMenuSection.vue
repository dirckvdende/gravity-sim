<template>
    <div :class="$style.section">
        <slot />
    </div>
</template>

<style lang="scss" module>
    @use "./style.scss";
    .section {
        width: 100%;
        padding: .8em 0;
        border-top: .1em solid var(--side-menu-line-color);

        &:not(:last-child)::after {
            @extend %hr;
        }
    }
</style>