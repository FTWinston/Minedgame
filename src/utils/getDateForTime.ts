import { getDateString } from './getDateString';

/** Given a time string (HH:mm:ss format), gets the time value (epoch ms) of the closest UTC past Date at that time. */
export function getDateForTime(strTime: string): Date {
    const now = new Date();
    const strToday = getDateString(now);
    const date = new Date(`${strToday}T${strTime}.000+00:00`);

    // If that time TODAY is in the future, subtract a day.
    if (date > now) {
        date.setDate(date.getDate() - 1);
    }

    return date;
}
