<script setup lang="ts">
    import type Vector2 from '@/util/linalg/Vector2';
    import { useWebGLCallback } from './useWebGLCallback';
    import vertexShader from "./path.vert?raw";
    import fragmentShader from "./path.frag?raw";
    import { createProgram } from './util';
    import { inject } from 'vue';
    import { webGLKey } from './state';
    import { useDevicePixelRatio } from '@vueuse/core';

    const {
        head,
        maxSize = 10000,
        color = [0, 0, 0, 1],
        width = 2,
    } = defineProps<{
        /** Current head of the path. Path is extended when this prop changes */
        head: Vector2
        /**
         * Maximum number of points in the path, after which the start of the
         * path is cut off. This cannot be changed dynamically!
         */
        maxSize?: number
        /**
         * RGBA color of the path, with entries in the range [0, 1] (default
         * black)
         */
        color?: [number, number, number, number]
        /** Width of the line in CSS pixels (not device pixels) (default 2) */
        width?: number
    }>()

    const { transform, canvasHeight, canvasWidth } = inject(webGLKey)!
    const { pixelRatio } = useDevicePixelRatio()

    // Current path length
    let length = 0

    useWebGLCallback((gl: WebGLRenderingContext) => {
        const program = createProgram(gl, vertexShader, fragmentShader)
        const positionLocations = [
            gl.getAttribLocation(program, "prev_position"),
            gl.getAttribLocation(program, "cur_position"),
            gl.getAttribLocation(program, "next_position"),
        ] as const
        const transformLocation = gl.getUniformLocation(program, "transform")
        const colorLocation = gl.getUniformLocation(program, "color")
        const canvasSizeLocation = gl.getUniformLocation(program, "canvas_size")
        const widthLocation = gl.getUniformLocation(program, "width")

        // Buffer data structure (with four points):
        //     [ * p2 p3 p4 * _ _ _ * p1 p2 * ]
        // Where the asterisks (*) indicate "padding" used to make sure
        // "previous" and "next" can be passed for first and last point in the
        // path. The startPointer points to the start of p1. Note that p2 is
        // duplicates when the list of points wraps around. Each cell in this
        // representation is 6 floats. E.g. for p1 this is
        //     [ p1x, p1y, 0, p1x, p1y, 1 ]
        // This allows the drawing of two vertices for every point in the path.
        // The padding is of the form
        //     [ 0, 0, -1, 0, 0, -1 ]
        // When the buffer is full it will look like this:
        //     [ * p2 p3 p4 p5 p6 p7 * p1 p2 * ]
        // Note there are only three spots with padding

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const bufferItemStride = 3
        const bufferItemSize = bufferItemStride * 2
        const floatSize = Float32Array.BYTES_PER_ELEMENT
        const bufferSize = bufferItemSize * (maxSize + 4)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferSize),
            gl.STATIC_DRAW)
        
        let lastPosition = head
        let startPointer = bufferItemSize
        length = 0

        /**
         * Add a point to the position buffer, with padding after it
         * @param point The point to add
         * @param pointer Pointer to the location in the buffer
         * @param paddingBefore Whether to add padding before the point. Padding
         * will always be added after
         */
        function updateBufferPoint(
            point: Vector2,
            pointer: number,
            paddingBefore: boolean,
        ): void {
            if (paddingBefore) {
                const offset = (pointer - bufferItemSize) * floatSize
                gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array([
                    0, 0, -1,
                    0, 0, -1,
                    point.x, point.y, 0,
                    point.x, point.y, 1,
                    0, 0, -1,
                    0, 0, -1,
                ]))
            } else {
                const offset = pointer * floatSize
                gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array([
                    point.x, point.y, 0,
                    point.x, point.y, 1,
                    0, 0, -1,
                    0, 0, -1,
                ]))
            }
        }

        /**
         * Add a point to the end of the position buffer
         * @param point The point to add
         */
        function addPointToBuffer(point: Vector2, last: Vector2): void {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            length++
            if (length == 1) {
                updateBufferPoint(point, startPointer, true)
                return
            }
            if (length > maxSize) {
                length--
                startPointer = (startPointer + bufferItemSize) % bufferSize
            }
            let endPointer = (startPointer + (length - 1) * bufferItemSize)
                % bufferSize
            if (endPointer + bufferItemSize >= bufferSize) {
                updateBufferPoint(last, bufferItemSize, true)
                endPointer = bufferItemSize * 2
            }
            updateBufferPoint(point, endPointer, false)
        }

        /**
         * Draw a path from a list of points that is contiguously stored in
         * memory
         * @param startPointer Pointer to the first point in the path
         * @param length Number of points in the path
         */
        function drawPathRange(startPointer: number, length: number): void {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            for (const [index, location] of positionLocations.entries()) {
                gl.enableVertexAttribArray(location)
                gl.vertexAttribPointer(location, bufferItemStride, gl.FLOAT,
                    false, bufferItemStride * floatSize, (startPointer +
                    (index - 1) * bufferItemSize) * floatSize)
            }
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, length * 2)
        }

        /** Draw the path stored in the position buffer */
        function drawPath(): void {
            if (startPointer + (length + 1) * bufferItemSize <= bufferSize) {
                drawPathRange(startPointer, length)
            } else {
                const firstLength = (bufferSize - startPointer)
                    / bufferItemSize - 1
                drawPathRange(startPointer, firstLength)
                drawPathRange(bufferItemSize, length - firstLength)
            }
        }

        /** Called every frame */
        function frame(): void {
            gl.useProgram(program)
            gl.uniformMatrix3fv(transformLocation, false, transform.value)
            gl.uniform4fv(colorLocation, color)
            gl.uniform2f(canvasSizeLocation, canvasWidth.value,
                canvasHeight.value)
            gl.uniform1f(widthLocation, width * pixelRatio.value)
            if (!lastPosition.subtract(head).isZero())
                addPointToBuffer(head, lastPosition)
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