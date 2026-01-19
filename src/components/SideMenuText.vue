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
        font-size: .65em;
        margin: .7em 0;
        color: var(--side-menu-icon-color);

        a {
            color: inherit;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>