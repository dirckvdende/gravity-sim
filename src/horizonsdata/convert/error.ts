
/**
 * Error to be thrown during conversion from object files to a single state file
 */
export class ConversionError extends Error {

    /**
     * Constructor
     * @param message Error message
     */
    constructor(message?: string) {
        super(message)
        this.name = "ConversionError"
    }

}