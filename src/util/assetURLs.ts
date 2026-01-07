
/** URLs of icon files */
export const iconURLs = Object.values(import.meta.glob(
    "@/assets/icons/**/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}", {
        eager: true,
        query: "?url",
        import: "default",
    }
)) as readonly string[]

/** URLs of preset scenarios */
export const scenarioURLs = Object.values(import.meta.glob(
    "@/assets/scenarios/**/*.grav", {
        eager: true,
        query: "?url",
        import: "default",
    }
)) as readonly string[]