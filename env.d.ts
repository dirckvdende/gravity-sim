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
}