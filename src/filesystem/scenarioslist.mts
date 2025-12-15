
/**
 * Get a list of all files in the "scenarios" folder
 * @returns The file list as strings
 */
export function scenariosList(): string[] {
    const scenarios = import.meta.glob("@/../public/scenarios/*.grav")
    const files: string[] = []
    for (const key in scenarios)
        files.push(`.${key}`)
    return files
}