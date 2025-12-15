
/**
 * Get a list of all files in the "scenarios" folder
 * @returns The file list as strings
 */
export function scenariosList(): string[] {
    // @ts-ignore
    const scenarios = SCENARIOS as string[]
    const files: string[] = []
    for (const key of scenarios)
        files.push(`./scenarios/${key}`)
    return files
}