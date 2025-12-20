
/**
 * Get a list of all files in the "icons" folder
 * @returns The file list as strings
 */
export function iconList(): string[] {
    // @ts-ignore
    const files = ICON_FILES as string[]
    return files.map((key) => `./icons/${key}`)
}