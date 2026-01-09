
import type { InjectionKey } from "vue"
import type { MapState } from "./mapState"
import type { UseWebGLTransformReturn } from "@/composables/useWebGLTransform";

/** Key used for inject-provide in map component */
export const mapStateKey = Symbol() as InjectionKey<MapState>
/** Key for injected WebGL context */
export const webGLKey = Symbol() as InjectionKey<UseWebGLTransformReturn>