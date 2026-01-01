
import type { InjectionKey } from "vue";
import type { UseWebGLTransformReturn } from "./useWebGLTransform";

/** Key for injected WebGL context */
export const webGLKey = Symbol() as InjectionKey<UseWebGLTransformReturn>