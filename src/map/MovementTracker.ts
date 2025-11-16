
import EventHook from "@/util/EventHook"
import Vector2 from "@/util/Vector2"

/**
 * Object used to track panning and zooming of a map
 */
export default class MovementTracker {

    // Update event, emitted when position of zoom level changes
    readonly update: EventHook
    // Position of the center of the map
    private position: Vector2
    // Map zoom level (0 = default)
    private zoomLevel: number
    // Inertia decrease speed in px/s^2
    private readonly inertiaDropoff: number
    // Whether inertia is enabled
    private readonly inertia: boolean
    // Last pan difference
    private lastPan: Vector2
    // Last time a pan was performed
    private lastPanTime: number
    // Current function handling inertia animation
    private inertiaFunction?: () => void

    /**
     * Constructor
     * @param options Options for the movement tracker
     */
    constructor(options?: { inertiaDropoff?: number, inertia?: boolean }) {
        options ??= {}
        this.update = new EventHook()
        this.position = Vector2.Zero
        this.zoomLevel = 0
        this.inertiaDropoff = options.inertiaDropoff ?? 3500
        this.inertia = options.inertia ?? true
        this.lastPan = Vector2.Zero
        this.lastPanTime = 0
    }

    /**
     * Pan by a given difference, which is measured in pixels and therefore
     * adjusted based on the current zoom level
     * @param diff The panning difference in pixels
     */
    pan(diff: Vector2) {
        this.lastPan = diff
        this.lastPanTime = performance.now()
        this.position = this.position.add(diff.scale(this.pixelSize()))
        if (!diff.isZero())
            this.update.emit()
    }

    /**
     * Adjust the zoom level with the given difference
     * @param diff Zoom level difference
     */
    zoom(diff: number): void {
        this.zoomLevel += diff
        if (diff != 0)
            this.update.emit()
    }

    /**
     * Animate inertia based on the last pan difference. This has no effect if
     * inertia is disabled. If there is already an inertia animation playing,
     * this is overwritten with the new animation
     */
    startInertia(): void {
        if (!this.inertia)
            return
        const timeDiff = (performance.now() - this.lastPanTime) / 1000
        if (timeDiff == 0)
            return
        let velocity = this.lastPan.length() / timeDiff
        const direction = this.lastPan.normalize()
        let lastFrame = performance.now()
        const inertiaFunction = this.inertiaFunction = () => {
            console.log("inertia function")
            if (this.inertiaFunction != inertiaFunction)
                return
            const timeDiff = (performance.now() - lastFrame) / 1000
            lastFrame = performance.now()
            velocity -= timeDiff * this.inertiaDropoff
            if (velocity < 0)
                return
            const diff = direction.scale(velocity)
            this.position = this.position.add(diff.scale(this.pixelSize() *
            timeDiff))
            if (!diff.isZero())
                this.update.emit()
            requestAnimationFrame(inertiaFunction)
        }
        requestAnimationFrame(inertiaFunction)
    }

    /**
     * Cancel current inertia animation
     */
    cancelInertia(): void {
        this.inertiaFunction = undefined
    }

    /**
     * Get the current position of the movement tracker
     * @returns The current position
     */
    getPosition(): Vector2 { return this.position }

    /**
     * Get the current zoom level of the movement tracker
     * @returns The current zoom level
     */
    getZoomLevel(): number { return this.zoomLevel }

    /**
     * Get the size of a pixel given the current zoom level
     * @returns The size of a single pixel in units measured by this tracker
     */
    private pixelSize(): number {
        return Math.exp(-this.zoomLevel)
    }

}