
import { onMounted, onUnmounted, toRef, toValue, watch, type MaybeRefOrGetter } from
"vue";

/**
 * Options for key events
 */
export type KeyEventOptions = {
    /**
     * Event emit mode. Press means it will be emitted when releasing the key.
     * Hold means it will be emitted as long as the key is held (event frame)
     * (default press)
     */
    mode?: "press" | "hold",
    /**
     * Whether the keys should be case insensitive, meaning holding the shift
     * key or not doesn't have an effect (default false)
     */
    caseInsensitive?: boolean,
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
     * Keydown event callback
     * @param event Emitted keydown event
     */
    function keydown(event: KeyboardEvent): void {
        if (!isKey(event.key))
            return
        if ((optionsRef.value?.mode ?? "press") == "hold")
            requestAnimationFrame(() => holdEmit(event))
    }

    /**
     * Keyup event callback
     * @param event Emitted keyup event
     */
    function keyup(event: KeyboardEvent): void {
        if (!isKey(event.key))
            return
        holdActive = false
        if ((optionsRef.value?.mode ?? "press") == "press")
            callback(event)
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