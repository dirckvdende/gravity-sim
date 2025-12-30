
import { computed, toValue, watch, type ComputedRef, type MaybeRefOrGetter,
type ShallowRef} from "vue"
import { useAdaptiveCanvasSize } from "../useAdaptiveCanvasSize"
import { clearContext, viewportToCanvasSize } from "./util"

/**
 * Callback for when a new rendering context is created/used by the useWebGL
 * composable. An object with frame and exit functions can be returned, which
 * are called on every frame and when the rendering context exits, respectively
 * @param gl The new rendering context
 */
export type WebGLCallback = (gl: WebGLRenderingContext) => void | {
    /** Called every frame, as long as the context is active */
    frame?: () => void
    /** Called when the context is no longer used */
    exit?: () => void
}

/** Return value of the useWebGL composable */
export type UseWebGLReturn = {
    /** WebGL rendering context of the canvas */
    gl: ComputedRef<WebGLRenderingContext | null>
    /**
     * Add a callback for initialization of a rendering context. The callback is
     * also called when addCallback is called and a context is already active
     * @param callback The callback to add
     * @returns Unique identifier that can be used to remove the callback using
     * removeCallback()
     */
    addCallback: (callback: WebGLCallback) => number
    /**
     * Remove callback created with addCallback(). This immediately calls the
     * exit() function if it was given. frame() is no longer called
     * @param id Identifier returned by addCallback
     */
    removeCallback: (id: number) => void
    /** When called, an extra frame is rendered */
    extraFrame: () => void
    /** Width of the canvas */
    canvasWidth: Readonly<ShallowRef<number>>
    /** Height of the canvas */
    canvasHeight: Readonly<ShallowRef<number>>
}

/**
 * Composable for registering callbacks at initialization, frame, and exit of
 * rendering context
 * @param gl The rendering context
 * @returns Functions for adding and removing callbacks, and init/frame/exit
 * functions to call the appropriate callbacks
 */
function useWebGLCallbacks(gl: MaybeRefOrGetter<WebGLRenderingContext | null>) {
    // List with ID and callback (initializer)
    const callbacks: [number, WebGLCallback][] = []
    // List with ID and frame callback
    const frameCallbacks: [number, () => void][] = []
    // List with ID and exit callback
    const exitCallbacks: [number, () => void][] = []
    // Available unique ID to assign
    let availableId = 0
    // Whether there is an active rendering context
    let active = false

    /**
     * Call the init callback with the given ID and register frame and exit
     * callbacks (if applicable)
     * @param id The ID of the callback, which is given to the init, frame, and
     * exit callbacks
     * @param callback The init callback
     * @param gl The rendering context (this has to exist for this function to
     * be called)
     */
    function initCallback(
        id: number,
        callback: WebGLCallback,
        gl: WebGLRenderingContext,
    ): void {
        const { frame, exit } = callback(gl) ?? {}
        if (frame)
            frameCallbacks.push([id, frame])
        if (exit)
            exitCallbacks.push([id, exit])
    }

    /**
     * Add a callback
     * @param callback The callback to add, which is immediately called if there
     * is already a rendering context
     * @returns Unique ID of the callback, which can be used as a parameter of
     * remove()
     */
    function add(callback: WebGLCallback): number {
        const id = availableId++
        callbacks.push([id, callback])
        const glValue = toValue(gl)
        if (active && glValue)
            initCallback(id, callback, glValue)
        return id
    }

    /**
     * Remove an item from an array of pairs [ID, value], given by its ID.
     * Returns the value if it is found
     * @param array The array to splice
     * @param id The ID of the item to remove
     * @returns The removed item if it was present, null otherwise
     */
    function spliceById<T>(array: [number, T][], id: number): T | null {
        const index = array.findIndex(([itemId]) => itemId == id)
        if (index == -1)
            return null
        const removed = array.splice(index, 1)
        return removed[0]?.[1] ?? null
    }

    /**
     * Remove a callback. Calls the exit() function immediately if a rendering
     * context is active
     * @param id The ID of the callback to remove
     */
    function remove(id: number): void {
        spliceById(callbacks, id)
        spliceById(frameCallbacks, id)
        const exit = spliceById(exitCallbacks, id)
        if (toValue(gl))
            exit?.()
    }

    /**
     * Initialize all callbacks
     * @param gl The rendering context
     */
    function init(gl: WebGLRenderingContext): void {
        if (active)
            return
        for (const [id, callback] of callbacks)
            initCallback(id, callback, gl)
        active = true
    }

    /**
     * Call all frame callbacks
     * @param _gl The rendering context
     */
    function frame(_gl: WebGLRenderingContext): void {
        for (const [_id, callback] of frameCallbacks)
            callback()
    }

    /**
     * Call all exit callbacks, becuase rendering context exits. Note that the
     * rendering context has to still be present when this is called. This
     * rendering context is given as an argument
     * @param _gl The rendering context
     */
    function exit(_gl: WebGLRenderingContext): void {
        if (!active)
            return
        for (const [_id, callback] of exitCallbacks)
            callback()
        while (frameCallbacks.length > 0)
            frameCallbacks.pop()
        while (exitCallbacks.length > 0)
            exitCallbacks.pop()
        active = false
    }

    return { add, remove, init, frame, exit }
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
    const gl = computed(() =>
        toValue(canvas)?.getContext("webgl", { antialias: true }) ?? null)
    let animationFrame = -1

    const {
        add: addCallback,
        remove: removeCallback,
        init: initCallbacks,
        frame: frameCallbacks,
        exit: exitCallbacks,
    } = useWebGLCallbacks(gl)

    /**
     * Called on initialization of a rendering context
     * @param gl The rendering context
     */
    function init(gl: WebGLRenderingContext): void {
        if (!gl)
            throw new Error("Called init() when rendering context is null")
        viewportToCanvasSize(gl)
        initCallbacks(gl)
        animationFrame = requestAnimationFrame(() => frame(gl))
    }

    /**
     * Called every frame, as long as there's a rendering context
     * @param gl The rendering context
     */
    function frame(gl: WebGLRenderingContext): void {
        animationFrame = -1
        viewportToCanvasSize(gl)
        clearContext(gl)
        frameCallbacks(gl)
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
        exitCallbacks(gl)
    }

    watch(gl, (newGL, oldGL) => {
        if (oldGL)
            exit(oldGL)
        if (newGL)
            init(newGL)
    }, { immediate: true })

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
        gl, addCallback, removeCallback, extraFrame, canvasWidth, canvasHeight,
    }
}