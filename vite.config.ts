
import { fileURLToPath, URL } from "node:url"
import { type ConfigEnv, defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import { readdirSync } from "node:fs"
import { resolve } from "node:path"
import { cwd } from "node:process"

/**
 * Get an array of all files in a subdirectory of the "public" folder
 * @param dir The subdirectory to look through
 * @returns An array of all filenames
 */
function publicFiles(dir: string): string[] {
    const url = new URL(`./public/${dir}`, import.meta.url)
    return readdirSync(fileURLToPath(url))
}

/**
 * Get a path to an HTML file
 * @param name The name of the file, without ".html"
 * @returns The path to the file
 */
function htmlPath(name: string): string {
    return resolve(__dirname, `${name}.html`)
}

/**
 * Get the base URL from environment variables, or default to "/"
 * @param configEnv Loaded configuration
 * @returns The base URL as a string
 */
function baseURL(configEnv: ConfigEnv): string {
    const env = loadEnv(configEnv.mode, cwd())
    return env.VITE_BASE_URL ?? "/"
}

// https://vite.dev/config/
export default defineConfig((configEnv) => ({
    base: baseURL(configEnv),
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    define: {
        SCENARIOS: JSON.stringify(publicFiles("scenarios")),
        ICON_FILES: JSON.stringify(publicFiles("icons")),
    },
    build: {
        rollupOptions: {
            input: {
                main: htmlPath("index"),
                horizonsdata: htmlPath("horizons-data-import"),
            }
        }
    }
}))
