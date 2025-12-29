
import { computed, toValue, watch, type ComputedRef, type InjectionKey,
type MaybeRefOrGetter, type ShallowRef} from "vue"
import { useAdaptiveCanvasSize } from "../useAdaptiveCanvasSize"

/**
 * Compile a shader from source code
 * @param gl The WebGL context
 * @param type Type of shader to create
 * @param sourceCode Shader source code to compile
 * @returns The compiled shader
 */
export function createShader(gl: WebGLRenderingContext, type: number,
sourceCode: string): WebGLShader {
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
export function createVertexShader(gl: WebGLRenderingContext,
sourceCode: string): WebGLShader {
    return createShader(gl, gl.VERTEX_SHADER, sourceCode)
}

/**
 * Compile a fragment shader from source code
 * @param gl The WebGL context
 * @param sourceCode Shader source code to compile
 * @returns The compiled shader
 */
export function createFragmentShader(gl: WebGLRenderingContext,
sourceCode: string): WebGLShader {
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
export function createProgram(gl: WebGLRenderingContext,
vertexShader: WebGLShader | string, fragmentShader: WebGLShader | string):
WebGLProgram {
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
 * Object that can be used to set callbacks when WebGL rendering context
 * changes, at initialization, at exit, and every frame
 */
export type WebGLCallbacks = {
    /**
     * Called on initialization of a rendering context, and when the callback is
     * registered and there's already a context present
     * @param gl The rendering context
     */
    init?: (gl: WebGLRenderingContext) => void
    /**
     * Called every frame, as long as there's a rendering context
     * @param gl The rendering context
     */
    frame?: (gl: WebGLRenderingContext) => void
    /**
     * Called on exit of a rendering context, and when the callback is
     * unregistered and there's a context present
     * @param gl The rendering context
     */
    exit?: (gl: WebGLRenderingContext) => void
}

/** Return value of the useWebGL composable */
export type UseWebGLReturn = {
    /** WebGL rendering context of the canvas */
    gl: ComputedRef<WebGLRenderingContext | null>
    /**
     * Add callbacks for initialization, exit, and every frame
     * @param callbacks The callbacks to add
     * @returns Unique identifier that can be used to remove the callbacks using
     * removeCallbacks()
     */
    addCallbacks: (callbacks: WebGLCallbacks) => number
    /**
     * Remove callbacks createed with addCallbacks()
     * @param id Identifier returned by addCallbacks
     */
    removeCallbacks: (id: number) => void
    /** When called, an extra frame is rendered */
    extraFrame: () => void
    /** Width of the canvas */
    canvasWidth: Readonly<ShallowRef<number>>
    /** Height of the canvas */
    canvasHeight: Readonly<ShallowRef<number>>
}

/**
 * Get a WebGL rendering context for a canvas element. This also automatically
 * changes the canvas width and height to the correct number of screen pixels
 * @param canvas The canvas element to create a WebGL rendering context for
 * @returns The rendering context, and addCallbacks and removeCallbacks
 * functions to manage callbacks at initialization, every frame, and at exit
 */
export function useWebGL(canvas: MaybeRefOrGetter<HTMLCanvasElement | null>):
UseWebGLReturn {
    const callbackList: Map<number, WebGLCallbacks> = new Map()
    let availableId = 0
    const gl = computed(() =>
        toValue(canvas)?.getContext("webgl", { antialias: true}) ?? null)
    let animationFrame = -1

    /**
     * Called on initialization of a rendering context
     * @param gl The rendering context
     */
    function init(gl: WebGLRenderingContext): void {
        gl.viewport(0, 0, toValue(canvas)?.width ?? 0,
            toValue(canvas)?.height ?? 0)
        for (const [ _id, { init } ] of callbackList)
            init?.(gl)
        animationFrame = requestAnimationFrame(() => frame(gl))
    }

    /**
     * Called every frame, as long as there's a rendering context
     * @param gl The rendering context
     */
    function frame(gl: WebGLRenderingContext): void {
        animationFrame = -1
        gl.viewport(0, 0, toValue(canvas)?.width ?? 0,
            toValue(canvas)?.height ?? 0)
        for (const [ _id, { frame } ] of callbackList)
            frame?.(gl)
        animationFrame = requestAnimationFrame(() => frame(gl))
    }

    /**
     * Called at exit of a rendering context
     * @param gl The rendering context
     */
    function exit(gl: WebGLRenderingContext): void {
        if (animationFrame != -1)
            cancelAnimationFrame(animationFrame)
        animationFrame = -1
        for (const [ _id, { exit } ] of callbackList)
            exit?.(gl)
    }

    watch(gl, (newGL, oldGL) => {
        if (oldGL != null)
            exit(oldGL)
        if (newGL != null)
            init(newGL)
    }, { immediate: true })

    /**
     * Add callbacks for initialization, exit, and every frame
     * @param callbacks The callbacks to add
     * @returns Unique identifier that can be used to remove the callbacks using
     * removeCallbacks()
     */
    function addCallbacks(callbacks: WebGLCallbacks): number {
        const id = availableId++
        callbackList.set(id, { ...callbacks })
        if (gl.value != null)
            callbacks.init?.(gl.value)
        return id
    }

    /**
     * Remove callbacks createed with addCallbacks()
     * @param id Identifier returned by addCallbacks
     */
    function removeCallbacks(id: number): void {
        const callbacks = callbackList.get(id)
        if (gl.value != null)
            callbacks?.exit?.(gl.value)
        callbackList.delete(id)
    }

    /** Render an extra frame */
    function extraFrame(): void {
        if (!gl.value)
            return
        frame(gl.value)
    }

    const {
        width: canvasWidth,
        height: canvasHeight,
    } = useAdaptiveCanvasSize(canvas)
    watch([canvasWidth, canvasHeight], () => extraFrame())

    return {
        gl, addCallbacks, removeCallbacks, extraFrame, canvasWidth,
        canvasHeight,
    }
}