
import { iconURLs } from "@/util/assetURLs"
import moonIcon from "@/assets/icons/moon.svg"

/**
 * Find an icon to give to a gravity object based on its name. Icons are listed
 * in "/public/icons" and if no applicable icon can be found "moon.svg" is used
 * @param name The name of the gravity object
 * @returns Name of the icon to use as a path to the file
 */
export function objectIconFromName(name: string): string {
    let icon = moonIcon
    for (const iconFile of iconURLs) {
        const split = iconFile.split("/")
        const iconName = split[split.length - 1]!.split(".")[0]!
        if (name.toUpperCase().includes(iconName.toUpperCase()))
            icon = iconFile
    }
    return icon
}