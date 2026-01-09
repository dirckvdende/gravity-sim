
import Vector2 from "@/util/linalg/Vector2"

/**
 * Find a zoom level that displays all of the given points (centered at the
 * origin) within a radius of 400 pixels
 * @param points The points to display
 * @returns The appropriate zoom level
 */
export function zoomLevelCover(points: Vector2[]): number {
    const PIXEL_RADIUS = 400
    const lengths = points.map((point) => point.length())
    const maxLength = Math.max(1, ...lengths)
    const pixelSize = maxLength / PIXEL_RADIUS
    return -Math.log(pixelSize)
}