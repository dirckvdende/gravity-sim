
/**
 * Get a list of all files in the "icons" folder
 * @returns The file list as strings
 */
export function iconList(): string[] {
    return ICON_FILES.map((key) => `./icons/${key}`)
}