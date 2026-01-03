
/**
 * Get a list of all files in the "scenarios" folder
 * @returns The file list as strings
 */
export function scenariosList(): string[] {
    const files: string[] = []
    for (const key of SCENARIOS)
        files.push(`./scenarios/${key}`)
    return files
}