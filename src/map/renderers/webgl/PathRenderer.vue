<script setup lang="ts">
    import type Vector2 from '@/util/linalg/Vector2';
    import { useWebGLCallback } from './useWebGLCallback';
    import vertexShader from "./path.vert?raw";
    import fragmentShader from "./path.frag?raw";
    import { createProgram } from './util';
    import { inject } from 'vue';
    import { webGLKey } from './state';

    const {
        head,
        maxSize = 10000,
    } = defineProps<{
        /** Current head of the path. Path is extended when this prop changes */
        head: Vector2
        /**
         * Maximum number of points in the path, after which the start of the
         * path is cut off. This cannot be changed dynamically!
         */
        maxSize?: number
    }>()

    const { transform } = inject(webGLKey)!

    // Current path length
    let length = 0

    useWebGLCallback((gl: WebGLRenderingContext) => {
        const program = createProgram(gl, vertexShader, fragmentShader)
        const positionLocation = gl.getAttribLocation(program, "position")
        const transformLocation = gl.getUniformLocation(program, "transform")

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const bufferItemSize = 2
        const floatSize = 4
        // const bufferSize = bufferItemSize * (maxSize + 4)
        const bufferSize = bufferItemSize * maxSize
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferSize),
            gl.STATIC_DRAW)
        
        let lastPosition = head
        let startPointer = 0
        length = 0

        /**
         * Add a point to the end of the position buffer
         * @param point The point to add
         */
        function addPointToBuffer(point: Vector2): void {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            length++
            if (length > maxSize) {
                length--
                startPointer = (startPointer + bufferItemSize) % bufferSize
            }
            const offset = (startPointer + (length - 1) * bufferItemSize)
                % bufferSize
            gl.bufferSubData(gl.ARRAY_BUFFER, offset * floatSize,
                new Float32Array([point.x, point.y]))
        }

        /** Draw the path stored in the position buffer */
        function drawPath(): void {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            if (startPointer + length * bufferItemSize <= bufferSize) {
                gl.drawArrays(gl.LINE_STRIP, startPointer, length)
            } else {
                gl.drawArrays(gl.LINE_STRIP, startPointer,
                    bufferSize - startPointer)
                gl.drawArrays(gl.LINE_STRIP, 0,
                    length - (bufferSize - startPointer) / bufferItemSize)
            }
        }

        /** Called every frame */
        function frame(): void {
            gl.useProgram(program)
            gl.uniformMatrix3fv(transformLocation, false, transform.value)
            if (!lastPosition.subtract(head).isZero())
                addPointToBuffer(head)
            lastPosition = head
            drawPath()
        }

        /** Called on context exit */
        function exit(): void {
            gl.deleteBuffer(positionBuffer)
        }

        return { frame, exit }
    })

    /** Clear the path */
    function clear(): void {
        length = 0
    }

    defineExpose({ clear })
</script>

<template></template>