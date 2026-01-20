
import { useActiveElement } from "@vueuse/core";
import { onMounted, onUnmounted, toRef, watch, type MaybeRefOrGetter } from
"vue";

/**
 * Options for key events
 */
export type KeyEventOptions = {
    /**
     * Event emit mode. Press means it will be emitted when releasing the key.
     * Hold means it will be emitted as long as the key is held (event frame)
     * (default press). Keydown means it will be triggered when the key is
     * pressed down
     */
    mode?: "press" | "hold" | "keydown",
    /**
     * Whether the keys should be case insensitive, meaning holding the shift
     * key or not doesn't have an effect (default false)
     */
    caseInsensitive?: boolean,
    /**
     * Prevent default event handler when this specific key is pressed (default
     * false). Only has an effect for modes "press" and "keydown"
     */
    preventDefault?: boolean,
    /**
     * Whether the ctrl key should be pressed with the key, or "ignore" to
     * ignore it (default false)
     */
    ctrlKey?: boolean | "ignore",
    /**
     * Whether the alt key should be pressed with the key, or "ignore" to
     * ignore it (default false)
     */
    altKey?: boolean | "ignore",
    /**
     * Whether the meta key should be pressed with the key, or "ignore" to
     * ignore it (default false)
     */
    metaKey?: boolean | "ignore",
}

/**
 * Detect keyboard events on the document
 * @param key The key to watch
 * @param callback Function to call when key is pressed
 * @param options Keyboard event options. Determines when events should be
 * emitted
 */
export function useKeyEvent(key: MaybeRefOrGetter<string | null>, callback:
(event: KeyboardEvent) => void, options?: MaybeRefOrGetter<KeyEventOptions>) {

    // Ref to the passed options
    const keyRef = toRef(key)
    const optionsRef = toRef(options)
    const activeElement = useActiveElement()
    // Whether the target key is currently being held. Used by the holdEmit
    // function to detect when to stop
    let holdActive = false

    /**
     * Function to call while the key is being pressed
     * @param event Emitted keydown event
     */
    function holdEmit(event: KeyboardEvent): void {
        if (!holdActive)
            return
        callback(event)
        requestAnimationFrame(() => holdEmit(event))
    }

    /**
     * Whether the given key is being pressed, keeping case sensitivity settings
     * in mind
     * @param key The key to check
     * @returns Boolean indicating if the key is the same as the configured key
     */
    function isKey(key: string): boolean {
        const requiredKey = keyRef.value
        if (requiredKey == null)
            return false
        return key == requiredKey || (!!optionsRef.value?.caseInsensitive &&
            key.toUpperCase() === requiredKey.toUpperCase())
    }

    /**
     * Check if a key press has a correct combination of ctrl, alt and meta keys
     * pressed
     * @param event The keyboard event of the key press
     */
    function hasCtrlAltMeta(event: KeyboardEvent): boolean {
        const ctrlKey = optionsRef.value?.ctrlKey ?? false
        const altKey = optionsRef.value?.altKey ?? false
        const metaKey = optionsRef.value?.metaKey ?? false
        return (ctrlKey === "ignore" || ctrlKey === event.ctrlKey)
            && (altKey === "ignore" || altKey === event.altKey)
            && (metaKey === "ignore" || metaKey === event.metaKey)
    }

    /**
     * Keydown event callback
     * @param event Emitted keydown event
     */
    function keydown(event: KeyboardEvent): void {
        if (!isKey(event.key) || !hasCtrlAltMeta(event)
        || activeElement.value?.tagName == "INPUT")
            return
        holdActive = true
        if (optionsRef.value?.mode == "hold")
            requestAnimationFrame(() => holdEmit(event))
        if (optionsRef.value?.mode == "keydown" && hasCtrlAltMeta(event)) {
            callback(event)
            if (optionsRef.value?.preventDefault)
                event.preventDefault()
        }
    }

    /**
     * Keyup event callback
     * @param event Emitted keyup event
     */
    function keyup(event: KeyboardEvent): void {
        if (!isKey(event.key) || !holdActive)
            return
        holdActive = false
        if ((optionsRef.value?.mode ?? "press") == "press" &&
        hasCtrlAltMeta(event)) {
            callback(event)
            if (optionsRef.value?.preventDefault)
                event.preventDefault()
        }
    }

    /**
     * Update events based on set key and options
     * @param param0 New key and options values
     * @param param1 Old key and options values
     */
    function loadEvent([newKey, _newOptions]: [string | null, KeyEventOptions |
    undefined], [oldKey, _oldOptions]: [string | null, KeyEventOptions |
    undefined]): void {
        if (oldKey) {
            document.removeEventListener("keydown", keydown)
            document.removeEventListener("keyup", keyup)
            holdActive = false
        }
        if (newKey) {
            document.addEventListener("keydown", keydown)
            document.addEventListener("keyup", keyup)
        }
    }

    watch([keyRef, optionsRef], loadEvent)
    onMounted(() => loadEvent(
        [keyRef.value, optionsRef.value],
        [null, undefined]
    ))
    onUnmounted(() => loadEvent(
        [null, undefined],
        [keyRef.value, optionsRef.value]
    ))
}