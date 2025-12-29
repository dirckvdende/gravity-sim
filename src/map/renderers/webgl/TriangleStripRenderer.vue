<script setup lang="ts">
    import type Vector2 from '@/util/linalg/Vector2';
    import { inject, onMounted, onUnmounted, ref, type Ref } from 'vue';
    import { webGLKey } from './state';
    import { createProgram } from './useWebGL';
    import vertexShader from './triangleStrip.vert?raw';
    import fragmentShader from './triangleStrip.frag?raw';

    const {
        head,
        maxSize = 1000,
    } = defineProps<{
        head: Vector2
        maxSize?: number
    }>()

    const webgl = inject(webGLKey)!
    const {
        addCallbacks, removeCallbacks, transform, canvasWidth, canvasHeight,
    } = webgl

    function init(gl: WebGLRenderingContext) {
        let program = createProgram(gl, vertexShader, fragmentShader)
        let positionLocation = gl.getAttribLocation(program, "a_position")
        let canvasSizeLocation = gl.getUniformLocation(program, "canvas_size")
        let transformLocation = gl.getUniformLocation(program, "u_transform")
        let positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const positions = [
            0, 1e11,
            1e11, 0,
            0, -1e11,
            -1e11, 0,
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
            gl.STATIC_DRAW)
        return {
            program, positionLocation, canvasSizeLocation, transformLocation,
            positionBuffer,
        }
    }

    function frame(gl: WebGLRenderingContext, data: ReturnType<typeof init>):
    void {
        const {
            program, canvasSizeLocation, transformLocation, positionBuffer,
            positionLocation,
        } = data
        gl.useProgram(program)
        gl.uniform2f(canvasSizeLocation, canvasWidth.value, canvasHeight.value)
        gl.uniformMatrix3fv(transformLocation, false, transform.value)
        gl.enableVertexAttribArray(positionLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    }

    function exit(gl: WebGLRenderingContext, data: ReturnType<typeof init>):
    void {
        gl.deleteBuffer(data.positionBuffer)
    }

    let callbacksId = -1
    onMounted(() => callbacksId = addCallbacks({ init, frame, exit }))
    onUnmounted(() => {
        if (callbacksId != -1)
            removeCallbacks(callbacksId)
    })
</script>

<template></template>

<style lang="scss" module>

</style>