
/**
 * Prompt the user to upload a file and get its contents
 * @param extension Filename extension that can be uploaded (default ".txt")
 * @returns A promise to a string with the file contents
 */
export async function uploadString(extension?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const inputElement = document.createElement("input")
        inputElement.type = "file"
        inputElement.accept = extension ?? ".txt"
        inputElement.addEventListener("change", () => {
            if (inputElement.files == null || inputElement.files.length == 0)
                return
            const file = inputElement.files[0]
            if (file == undefined)
                return
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                if (typeof reader.result != "string") {
                    reject("Reader result is not a string")
                    return
                }
                resolve(reader.result)
            })
            reader.readAsText(file)
        })
        inputElement.click()
    })
}