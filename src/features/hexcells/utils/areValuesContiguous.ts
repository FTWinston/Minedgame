/** Indicates whether all values in an array which pass a particular test are contiguous. If looped is true, considers the ends of the array to be adjacent. */
export function areValuesContiguous<TValue>(values: TValue[], isMatch: (value: TValue) => boolean, looped: boolean) {
    let firstMatch: number;
    let lastMatch: number;

    if (looped) {
        // Find a match immediately preceded by an non-match. That's the first match.
        // Working back from there, find a match. That's the last match.
        // (In each case, loop if needed.)
        firstMatch = lastMatch = values.findIndex((cell, index) => isMatch(cell) && !isMatch(values[index === 0 ? values.length - 1 : index - 1]));

        // If there's no match preceded by a non-match, values are contiguous only if they all match.
        if (firstMatch === -1) {
            return values.every(isMatch);
        }

        for (let i = firstMatch - 2; i !== firstMatch; i--) {
            if (i < 0) {
                i = values.length - 1;
            }
            if (isMatch(values[i])) {
                lastMatch = i;
                break;
            }
        }
    }

    else {
        // When not looped, determining the first and last match are simple.
        firstMatch = values.findIndex(isMatch);
        
        if (firstMatch === -1) {
            return false;
        }

        lastMatch = values.findLastIndex(isMatch);
    }

    // If there's a non-match between these two, return false.
    for (let i = firstMatch + 1; i !== lastMatch; i++) {
        if (i >= values.length) {
            // This can only happen when looped is true. Otherwise, lastMatch will always be greater or equal to firstMatch. Either way, lastMatch is less than values.length.
            if (lastMatch === 0) {
                break;
            }
            i = 0;
        }
        if (!isMatch(values[i])) {
            return false;
        }
    }

    return true;
}
