<script setup lang="ts">
    import { provide, useTemplateRef, watch } from 'vue';
    import { useWebGL, webGLKey, createProgram } from './webgl';
    import { useAdaptiveCanvasSize } from './useAdaptiveCanvasSize';

    const canvas = useTemplateRef("canvas")
    const webgl = useWebGL(canvas)
    provide(webGLKey, webgl)
    const { addCallbacks, extraFrame } = webgl

    const { width, height } = useAdaptiveCanvasSize(canvas)
    watch([width, height], () => extraFrame())

    let program: WebGLProgram | null = null
    let positionLocation = 0
    let canvasSizeLocation: WebGLUniformLocation | null = null
    let positionBuffer: WebGLBuffer | null = null

    function init(gl: WebGLRenderingContext): void {
        program = createProgram(gl, `
            attribute vec4 a_position;

            void main() {
                gl_Position = a_position;
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
        positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const positions = [
            0, 1,
            1, 0,
            0, -1,
            -1, 0,
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
            gl.STATIC_DRAW)
        gl.viewport(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0)
    }

    function frame(gl: WebGLRenderingContext): void {
        gl.viewport(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(program)
        gl.uniform2f(canvasSizeLocation, canvas.value?.width ?? 0, canvas.value?.height ?? 0)
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