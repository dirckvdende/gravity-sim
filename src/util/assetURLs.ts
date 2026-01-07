
export const iconURLs = Object.values(import.meta.glob(
    "@/assets/icons/**/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}", {
        eager: true,
        query: "?url",
        import: "default",
    }
)) as readonly string[]