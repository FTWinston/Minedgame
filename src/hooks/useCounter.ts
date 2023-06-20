import { useState } from 'react';

export function useCounter(): [number, () => void] {
    const [value, setValue] = useState(1);
    return [value, () => setValue(val => val + 1)];
}