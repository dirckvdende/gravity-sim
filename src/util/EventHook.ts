
/**
 * Custom event handler used to emit events and add hooks which get called when
 * the event is emitted
 */
export default class EventHook<ParameterType = void> {

    // List of hooks
    private handlers: ((value: ParameterType) => void)[]

    /**
     * Constructor
     */
    constructor() {
        this.handlers = []
    }

    /**
     * Emit the event
     * @param value The value to pass to the hook functions
     */
    emit(value: ParameterType): void {
        for (const handler of this.handlers)
            handler(value)
    }

    /**
     * Add a hook to the event
     * @param handler The handler to call when the event is emitted. If already
     * present nothing happens
     */
    hook(handler: (value: ParameterType) => void): void {
        if (this.handlers.indexOf(handler) != -1)
            return
        this.handlers.push(handler)
    }

    /**
     * Remove a hook from the event
     * @param handler The handler to remove. If not present nothing happens
     */
    unhook(handler: (value: ParameterType) => void): void {
        const index = this.handlers.indexOf(handler)
        if (index == -1)
            return
        this.handlers.splice(index, 1)
    }

}