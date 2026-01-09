
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from
"vue";
import { useWebGL, type UseWebGLReturn } from "@/composables/useWebGL";
import Vector2 from "@/util/linalg/Vector2";
import { useDevicePixelRatio } from "@vueuse/core";

/** Return value of the useWebGLTransform composable */
export type UseWebGLTransformReturn = UseWebGLReturn & {
    /**
     * Transformation matrix corresponding with the given translation and scale
     */
    transform: ComputedRef<number[]>
}

/** Options to pass to the useWebGLTransform composable */
export type UseWebGLTransformOptions = {
    /** Amount to translate coordinates */
    translate?: MaybeRefOrGetter<Vector2>
    /** Amount to scale coordinates in both directions */
    scale?: MaybeRefOrGetter<Vector2>
    /**
     * Whether to apply extra scaling from canvas size to clip space. No extra
     * translation is performed
     */
    scaleToCanvas?: MaybeRefOrGetter<boolean>
}

/**
 * Fill in default values in transform options, where no option is already given
 * @param options The initial options given
 * @returns The options with defaults filled in
 */
function defaultOptions(options?: UseWebGLTransformOptions):
Required<UseWebGLTransformOptions> {
    return {
        translate: Vector2.Zero,
        scale: new Vector2(1, 1),
        scaleToCanvas: false,
        ...options,
    }
}

/**
 * Get a WebGL context of a canvas and determine a transformation matrix to
 * apply based on translate/scale parameters. The canvas width and height are
 * automatically updated to the width and height in screen pixels
 * @param canvas The canvas to get the context of
 * @param options Translation and scaling to apply
 * @returns Same as useWebGL, with an added transform matrix
 */
export function useWebGLTransform(
    canvas: MaybeRefOrGetter<HTMLCanvasElement | null>,
    options?: UseWebGLTransformOptions,
): UseWebGLTransformReturn {
    const {
        translate,
        scale,
        scaleToCanvas,
    } = defaultOptions(options)
    const webgl = useWebGL(canvas)
    const { canvasWidth, canvasHeight } = webgl
    const { pixelRatio } = useDevicePixelRatio()
    const canvasScaleX = computed(() => !toValue(scaleToCanvas)
        || canvasWidth.value == 0 ? 1 : 2 / canvasWidth.value
        * pixelRatio.value)
    const canvasScaleY = computed(() => !toValue(scaleToCanvas)
        || canvasWidth.value == 0 ? 1 : 2 / canvasHeight.value
        * pixelRatio.value)
    const transform = computed(() => {
        // Scale = [
        //     1/sx, 0, 0,
        //     0, -1/sy, 0,
        //     0, 0, 1,
        // ]
        // Translate = [
        //     1, 0, tx,
        //     0, 1, ty,
        //     0, 0, 1,
        // ]
        // Scale * translate = [
        //     1/sx, 0, tx/sx,
        //     0, -1/sy, -ty/sy,
        //     0, 0, 1,
        // ]
        const scaleX = canvasScaleX.value / toValue(scale).x
        const scaleY = -canvasScaleY.value / toValue(scale).y
        const m = [
            scaleX, 0, 0,
            0, scaleY, 0,
            toValue(translate).x * scaleX, toValue(translate).y * scaleY, 1,
        ]
        return m
    })
    return { ...webgl, transform }
}