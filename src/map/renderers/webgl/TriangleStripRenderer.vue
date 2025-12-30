<script setup lang="ts">
    import type Vector2 from '@/util/linalg/Vector2';
    import { inject, onMounted, onUnmounted, ref, type Ref } from 'vue';
    import { webGLKey } from './state';
    import { createProgram } from './util';
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
        addCallback, removeCallback, transform, canvasWidth, canvasHeight,
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
        
        function frame(): void {
            gl.useProgram(program)
            gl.uniform2f(canvasSizeLocation, canvasWidth.value, canvasHeight.value)
            gl.uniformMatrix3fv(transformLocation, false, transform.value)
            gl.enableVertexAttribArray(positionLocation)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
        }

        function exit(): void {
            gl.deleteBuffer(positionBuffer)
        }

        return { frame, exit }
    }

    let callbackId = -1
    onMounted(() => callbackId = addCallback(init))
    onUnmounted(() => {
        if (callbackId != -1)
            removeCallback(callbackId)
    })
</script>

<template></template>

<style lang="scss" module>

</style>