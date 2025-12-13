
/**
 * Download the HTML serialized code of a node to a file
 * @param node The node to convert to a string
 * @param mimeType The mime type to output (default "text/html")
 * @param filename The default filename that is downloaded (default
 * "download.html")
 */
export function downloadNodeAsString(node: Node, mimeType: string = "text/html",
filename: string = "download.html"): void {
    const content = (new XMLSerializer()).serializeToString(node)
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.download = filename
    a.href = url
    a.click()
}