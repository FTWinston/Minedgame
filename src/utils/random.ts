export class Random {
    readonly seed: number;

    constructor(seed?: number) {
        // TODO: actually use seed, for reproducability.
        this.seed = seed === undefined
            ? 0
            : seed;
    }

    getFloat(min = 0, max = 1) {
        return min + Math.random() * (max - min);
    }

    getBoolean(chanceOfTrue = 0.5) {
        return Math.random() <= chanceOfTrue;
    }

    getInt(maxExclusive: number) {
        return Math.floor(Math.random() * maxExclusive);
    }

    pick<T>(values: T[]): T {
        if (values.length === 0) {
            throw new Error('pickRandom passed an empty array');
        }
    
        return values[this.getInt(values.length)];
    }

    insert<T>(array: T[], value: T) {
        const index = this.getInt(array.length + 1);
        array.splice(index, 0, value);
    }

    delete<T>(values: T[]): T | null {
        if (values.length === 0) {
            return null;
        }
    
        const index = this.getInt(values.length);
        const result = values[index];
        values.splice(index, 1);
        return result;
    }
}
