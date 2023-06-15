/** Given a date, return that date a string, in YYYY-MM-DD format. */
export function getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}
