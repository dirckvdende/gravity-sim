
import { type StyledGravityObject } from "@/sim/object"
import { iconList } from "@/filesystem/iconlist"

/**
 * Find an icon to give to a gravity object based on its name. Icons are listed
 * in "/public/icons" and if no applicable icon can be found "moon.svg" is used
 * @param object The gravity object to set the icon of
 * @returns A copy of the gravity object with the icon replaced
 */
export function setObjectIcon(object: StyledGravityObject): StyledGravityObject
{
    let icon = "./icons/moon.svg"
    for (const iconFile of iconList()) {
        const split = iconFile.split("/")
        const iconName = split[split.length - 1]!.split(".")[0]!
        if (object.name.toUpperCase().includes(iconName.toUpperCase()))
            icon = iconFile
    }
    return { ...object, icon }
}