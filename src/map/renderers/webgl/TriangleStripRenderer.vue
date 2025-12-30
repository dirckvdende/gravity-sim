<script setup lang="ts">
    import type Vector2 from '@/util/linalg/Vector2';
    import { inject } from 'vue';
    import { webGLKey } from './state';
    import { createProgram } from './util';
    import vertexShader from './triangleStrip.vert?raw';
    import fragmentShader from './triangleStrip.frag?raw';
    import { useWebGLCallback } from './useWebGLCallback';

    const {
        head,
        maxSize = 10000,
    } = defineProps<{
        head: Vector2
        maxSize?: number
    }>()

    const webgl = inject(webGLKey)!
    const { transform, canvasWidth, canvasHeight } = webgl

    useWebGLCallback((gl: WebGLRenderingContext) => {
        let program = createProgram(gl, vertexShader, fragmentShader)
        let positionLocation = gl.getAttribLocation(program, "a_position")
        let canvasSizeLocation = gl.getUniformLocation(program, "canvas_size")
        let transformLocation = gl.getUniformLocation(program, "u_transform")

        let positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const bufferSize = maxSize * 2
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferSize),
            gl.STATIC_DRAW)
        let lastPosition = head
        let start = 0
        let length = 0
        
        function frame(): void {
            gl.useProgram(program)
            gl.uniform2f(canvasSizeLocation, canvasWidth.value,
                canvasHeight.value)
            gl.uniformMatrix3fv(transformLocation, false, transform.value)
            gl.enableVertexAttribArray(positionLocation)

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            if (!lastPosition.subtract(head).isZero()) {
                length++
                if (length > maxSize) {
                    length--
                    start = (start + 1) % maxSize
                }
                const offset = (start + length - 1) * 2 % bufferSize
                gl.bufferSubData(gl.ARRAY_BUFFER, offset * 4,
                    new Float32Array([head.x, head.y]))
            }
            lastPosition = head

            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            if (start + length <= maxSize) {
                gl.drawArrays(gl.LINE_STRIP, start * 2, length)
            } else {
                gl.drawArrays(gl.LINE_STRIP, start, maxSize - start)
                gl.drawArrays(gl.LINE_STRIP, 0, length - (maxSize - start))
            }
        }

        function exit(): void {
            gl.deleteBuffer(positionBuffer)
        }

        return { frame, exit }
    })

    function clear(): void {

    }

    defineExpose({ clear })
</script>

<template></template>

<style lang="scss" module>

</style>