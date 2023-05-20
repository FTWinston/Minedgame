/** Given a time string (HH:mm format), gets the time value (epoch ms) of the closest UTC future Date at that time. */
export function getDateForTime(strTime: string, future: boolean): Date {
    const now = new Date();
    const strToday = now.toISOString().split('T')[0];
    const date = new Date(`${strToday}T${strTime}:00.000+00:00`);

    // If that time TODAY is in the past, add a day.
    if (future) {
        if (date < now) {
            date.setDate(date.getDate() + 1);
        }
    }
    else {
        if (date > now) {
            date.setDate(date.getDate() - 1);
        }
    }

    return date;
}
