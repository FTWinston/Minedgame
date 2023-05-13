import { useEffect, useState } from 'react';

/** Returns inputValue, until duration has passed Then returns defaultValue. */
export function useTemporaryValue<T>(inputValue: T, defaultValue: T, duration: number): T {
    const [outputValue, setOutputValue] = useState<T>(defaultValue);
    
    useEffect(() => {
        setOutputValue(inputValue);
        if (inputValue !== defaultValue) {
            return;
        }
        const timeout = setTimeout(() => setOutputValue(defaultValue), duration);
        return () => clearTimeout(timeout);
    }, [inputValue, defaultValue, duration]);

    return outputValue;
}
