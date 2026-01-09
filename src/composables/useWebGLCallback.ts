
import { inject, onMounted, onUnmounted } from "vue";
import type { WebGLCallback } from "./useWebGL";
import { webGLKey } from '@/util/keys';

/**
 * Add a callback to a provided WebGL context once the component is mounted.
 * Remove the callback when unmounted
 * @param callback The callback for the WebGL context
 */
export function useWebGLCallback(callback: WebGLCallback): void {
    const webgl = inject(webGLKey)
    if (!webgl)
        throw new Error("Cannot find provided WebGLTransform")
    const { addCallback, removeCallback } = webgl
    let callbackId = -1
    onMounted(() => {
        callbackId = addCallback(callback)
    })
    onUnmounted(() => {
        if (callbackId != -1)
            removeCallback(callbackId)
    })
}