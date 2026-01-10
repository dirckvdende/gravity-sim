// Temporary

import init, * as wasm from "rust"

init().then(() => wasm.greet("World"))