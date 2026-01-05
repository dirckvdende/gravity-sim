/// <reference types="vite/client" />

interface ViteTypeOptions {
    strictImportMetaEnv: unknown,
}

interface ImportMetaEnv {
    /** Whether a watermark "DEMO" should be shown */
    readonly VITE_DEMO_WATERMARK?: "false" | "true",
    /**
     * Whether a warning should be displayed if the user refreshes or exits the
     * page
     */
    readonly VITE_EXIT_WARNING?: "false" | "true",
    /** Project base URL */
    readonly VITE_BASE_URL?: string,
    /** Whether component performance markers should be inserted */
    readonly VITE_MEASURE_PERFORMANCE?: "false" | "true",
}

/** List of scenario files in the public folder */
declare const SCENARIOS: string[]
/** List of icon files in the public folder */
declare const ICON_FILES: string[]