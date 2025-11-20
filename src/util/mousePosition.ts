
import Vector2 from "./Vector2"

/**
 * Get the mouse position within a target element
 * @param target The target HTML element
 * @returns The mouse position in pixels
 */
export function mousePosition(target: HTMLElement, event: MouseEvent):
Vector2 {
    const targetRect = target.getBoundingClientRect()
    const mousePos = new Vector2(event.clientX, event.clientY)
    const targetPos = new Vector2(targetRect.left, targetRect.top)
    return mousePos.subtract(targetPos)
}