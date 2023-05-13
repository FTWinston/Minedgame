export function getRandomFloat() {
    return Math.random();
}

export function getRandomInt(maxExclusive: number) {
    return Math.floor(Math.random() * maxExclusive);
}

export function getRandom<T>(values: T[]): T | null {
    if (values.length === 0) {
        return null;
    }
    return values[getRandomInt(values.length)];
}

export function insertRandom<T>(array: T[], value: T) {
    const index = getRandomInt(array.length + 1);
    array.splice(index, 0, value);
}

export function deleteRandom<T>(values: T[]): T | null {
    if (values.length === 0) {
        return null;
    }

    const index = getRandomInt(values.length);
    const result = values[index];
    values.splice(index, 1);
    return result;
}
