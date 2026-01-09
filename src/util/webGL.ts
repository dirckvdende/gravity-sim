
/**
 * Compile a shader from source code
 * @param gl The WebGL context
 * @param type Type of shader to create
 * @param sourceCode Shader source code to compile
 * @returns The compiled shader
 */
export function createShader(
    gl: WebGLRenderingContext,
    type: number,
    sourceCode: string,
): WebGLShader {
    const shader = gl.createShader(type)
    if (!shader)
        throw new Error("Couldn't create shader")
    gl.shaderSource(shader, sourceCode)
    gl.compileShader(shader)
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader
    const error = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(error ?? "Couldn't create shader")
}

/**
 * Compile a vertex shader from source code
 * @param gl The WebGL context
 * @param sourceCode Shader source code to compile
 * @returns The compiled shader
 */
export function createVertexShader(
    gl: WebGLRenderingContext,
    sourceCode: string,
): WebGLShader {
    return createShader(gl, gl.VERTEX_SHADER, sourceCode)
}

/**
 * Compile a fragment shader from source code
 * @param gl The WebGL context
 * @param sourceCode Shader source code to compile
 * @returns The compiled shader
 */
export function createFragmentShader(
    gl: WebGLRenderingContext,
    sourceCode: string,
): WebGLShader {
    return createShader(gl, gl.FRAGMENT_SHADER, sourceCode)
}

/**
 * Create an link a program to a WebGL rendering context
 * @param gl The WebGL context
 * @param vertexShader The vertex shader to include in the program. If a string
 * is provided it will be interpreted as source code and compiled
 * @param fragmentShader The fragment shader to include in the program. If a
 * string is provided it will be interpreted as source code and compiled
 * @returns The created program
 */
export function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader | string,
    fragmentShader: WebGLShader | string,
): WebGLProgram {
    if (typeof vertexShader == "string")
        vertexShader = createVertexShader(gl, vertexShader)
    if (typeof fragmentShader == "string")
        fragmentShader = createFragmentShader(gl, fragmentShader)
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (gl.getProgramParameter(program, gl.LINK_STATUS))
        return program
    const error = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(error ?? "Coudn't create program")
}

/**
 * Set the viewport of a WebGL rendering context to the size of its canvas
 * @param gl The rendering context
 */
export function viewportToCanvasSize(gl: WebGLRenderingContext): void {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
}

/**
 * Clear a rendering context
 * @param gl The rendering context
 * @param color The color to clear with (default transparent)
 */
export function clearContext(
    gl: WebGLRenderingContext,
    color?: [number, number, number, number],
): void {
    gl.clearColor(...(color ?? [0, 0, 0, 0]))
    gl.clear(gl.COLOR_BUFFER_BIT)
}