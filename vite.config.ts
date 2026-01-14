
import { fileURLToPath, URL } from "node:url"
import { type ConfigEnv, defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import { resolve } from "node:path"
import { cwd } from "node:process"
import topLevelAwait from "vite-plugin-top-level-await"

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
        topLevelAwait(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: htmlPath("index"),
                horizonsdata: htmlPath("horizons-data-import"),
            },
            output: {
                assetFileNames: "[hash:16][extname]",
                chunkFileNames: "[hash:16].js",
                entryFileNames: "[hash:16].js",
            }
        }
    }
}))
