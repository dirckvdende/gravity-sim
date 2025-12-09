<template>
    <div :class="$style.section">
        <slot />
    </div>
</template>

<style lang="scss" module>
    @use "./style.scss";
    .section {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: .3em 0;

        &:not(:last-child)::after {
            @extend %hr;
        }
    }
</style>