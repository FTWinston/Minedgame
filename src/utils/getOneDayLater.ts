/** Get a date that is one day later than the given date. */
export function getOneDayLater(date: Date) {
    const addOneDay = new Date(date);
    addOneDay.setDate(addOneDay.getDate() + 1);
    return addOneDay;
}