
import type { ObjectFile } from "../object";
import { ConversionError } from "./error";

// Acceptable difference between timestamps
const EPS = 1e-2

/**
 * Get the timestamp to give a state file, from a list of object files
 * @param files The object files to get the timestamp for
 * @returns The timestamp as a date object
 * @throws ConversionError if timestamp in the listed files are not all the same
 */
export function getTimestamp(files: ObjectFile[]): Date {
    const first = files[0]?.time
    if (first == undefined)
        return new Date(Date.now())
    for (const file of files)
        if (Math.abs(file.time.getTime() - first.getTime()) >= EPS)
            throw new ConversionError("Timestamps of objects don't match")
    return first
}