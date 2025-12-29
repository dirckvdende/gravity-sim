<script setup lang="ts">
    import { computed, inject, provide, useTemplateRef } from 'vue';
    import { createProgram } from './useWebGL';
    import { webGLKey } from './state';
    import { useWebGLTransform } from './useWebGLTransform';
    import { defaultState, mapStateKey } from '@/map/state';
    import Vector2 from '@/util/linalg/Vector2';

    const { position, pixelSize } = inject(mapStateKey, defaultState())
    const translate = computed(() => position.value.negate())
    const scale = computed(() => {
        const value = pixelSize.value
        return new Vector2(value, value)
    })

    const canvas = useTemplateRef("canvas")
    const webgl = useWebGLTransform(canvas, {
        translate,
        scale,
        scaleToCanvas: true,
    })
    provide(webGLKey, webgl)
    const { addCallbacks, transform } = webgl

    let program: WebGLProgram | null = null
    let positionLocation = 0
    let canvasSizeLocation: WebGLUniformLocation | null = null
    let transformLocation: WebGLUniformLocation | null = null
    let positionBuffer: WebGLBuffer | null = null

    function init(gl: WebGLRenderingContext): void {
        program = createProgram(gl, `
            precision mediump float;
            attribute vec2 a_position;
            uniform mat3 u_transform;

            void main() {
                gl_Position = vec4(
                    (u_transform * vec3(a_position, 1)).xy, 0, 1);
            }
        `, `
            precision mediump float;
            uniform vec2 canvas_size;
            
            void main() {
                vec4 coord = gl_FragCoord;
                gl_FragColor = vec4(coord.xy / canvas_size, 0, 1);
            }
        `)
        positionLocation = gl.getAttribLocation(program, "a_position")
        canvasSizeLocation = gl.getUniformLocation(program, "canvas_size")
        transformLocation = gl.getUniformLocation(program, "u_transform")
        positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const positions = [
            0, 1e11,
            1e11, 0,
            0, -1e11,
            -1e11, 0,
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
            gl.STATIC_DRAW)
    }

    function frame(gl: WebGLRenderingContext): void {
        gl.useProgram(program)
        gl.uniform2f(canvasSizeLocation, canvas.value?.width ?? 0, canvas.value?.height ?? 0)
        gl.uniformMatrix3fv(transformLocation, false, transform.value)
        gl.enableVertexAttribArray(positionLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    }

    function exit(gl: WebGLRenderingContext): void {
        gl.deleteBuffer(positionBuffer)
    }

    addCallbacks({ init, frame, exit })
</script>

<template>
    <canvas :class="$style.canvas" ref="canvas">
        WebGL renderer not supported.
    </canvas>
</template>

<style lang="scss" module>
    .canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>