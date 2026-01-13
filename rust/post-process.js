
import { appendFileSync } from "node:fs"
import { join } from "node:path"

// Append top-level await to gravity_sim.js, so it can be imported directly
const appendString = "\nawait __wbg_init();"
appendFileSync(join(import.meta.dirname, "pkg", "gravity_sim.js"), appendString)