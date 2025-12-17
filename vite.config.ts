import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from "vite-plugin-vue-devtools"
import { readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

// List of predefined gravity sim scenarios
const scenarios = readdirSync(join(__dirname, "public", "scenarios"))

// https://vite.dev/config/
export default defineConfig({
    base: "/gravity-sim/",
    plugins: [
        vue(),
        vueDevTools()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    define: {
        /** List of predefined gravity sim scenarios */
        SCENARIOS: JSON.stringify(scenarios)
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                horizonsdata: resolve(__dirname, "horizonsdata.html"),
            }
        }
    }
})
