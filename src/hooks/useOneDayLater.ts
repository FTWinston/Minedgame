import { useMemo } from 'react';
import { getOneDayLater } from 'src/utils/getOneDayLater';

/** Get a memoised date that is one day later than the given date. */
export function useOneDayLater(date: Date) {
    return useMemo(() => {
        return getOneDayLater(date)
    }, [date]);
}