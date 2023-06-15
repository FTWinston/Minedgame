import { useMemo } from 'react';

/** Get a memoised date that is one day later than the given date. */
export function useOneDayLater(date: Date) {
    return useMemo(() => {
        const addOneDay = new Date(date);
        addOneDay.setDate(addOneDay.getDate() + 1);
        return addOneDay;
    }, [date]);
}