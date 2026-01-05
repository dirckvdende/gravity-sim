import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from "vite-plugin-vue-devtools"
import { readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

/**
 * Get an array of all files in a subdirectory of the "public" folder
 * @param dir The subdirectory to look through
 * @returns An array of all filenames
 */
function publicFiles(dir: string): string[] {
    const url = new URL(`./public/${dir}`, import.meta.url)
    return readdirSync(fileURLToPath(url))
}

// https://vite.dev/config/
export default defineConfig({
    base: "/gravity-sim/",
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    define: {
        SCENARIOS: publicFiles("scenarios"),
        ICON_FILES: publicFiles("icons"),
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                horizonsdata: resolve(__dirname, "horizons-data-import.html"),
            }
        }
    }
})
