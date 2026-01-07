
/** Display information for a file */
export type FileListItemDisplay = {
    /** Name of the file */
    filename: string
    /**
     * Display name to show instead of the filename, filename will be shown
     * greyed out behind it. If this is an empty string, the filename will be
     * shown instead
     */
    displayName: string
    /** Annotation to show below the filename */
    annotation: string
}