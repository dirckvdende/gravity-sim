
/** URLs of icon files with original filenames and import URLs */
export const iconURLs = Object.entries(import.meta.glob(
    "@/assets/icons/**/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}", {
        eager: true,
        query: "?url",
        import: "default",
    }
)).map(([filename, url]) => ({ filename, url })) as readonly {
    filename: string,
    url: string,
}[]

/** URLs of preset scenarios */
export const scenarioURLs = Object.values(import.meta.glob(
    "@/assets/scenarios/**/*.grav", {
        eager: true,
        query: "?url",
        import: "default",
    }
)) as readonly string[]