import { getDateString } from './getDateString';

export interface Stats {
    totalWins: number;
    totalLosses: number;
    totalMistakes: number;
    winStreak: number;
    perfectWinStreak: number;
    lastPlayed: string;
    version: number;
}

export function getStats(): Stats {
    return loadStats() ?? createNewStats();
}

export function updateStats(gameDate: Date, successToday: boolean, mistakesToday: number): Stats {
    const stats = getStats();

    const lastPlayedDate = new Date(stats.lastPlayed);
    const today = getStartOfDay(gameDate);

    // If today's game has already been played, don't update the stats.
    if (lastPlayedDate >= today) {
        return stats;
    }

    // If the last played game was longer ago than yesterday, reset streak.
    if (lastPlayedDate < getDayBefore(today)) {
        stats.winStreak = 0;
        stats.perfectWinStreak = 0;
    }

    // Update stats based on today's result.
    if (successToday) {
        stats.totalWins++;
        stats.totalMistakes += mistakesToday;

        stats.winStreak ++;

        if (mistakesToday === 0) {
            stats.perfectWinStreak++;
        }
    }
    else {
        stats.totalLosses++;
        stats.winStreak = 0;
        stats.perfectWinStreak = 0;
    }

    stats.lastPlayed = getDateString(today);

    saveStats(stats);

    return stats;
}

function getStartOfDay(date: Date): Date {
    const midnight = new Date(date);
    midnight.setUTCHours(0);
    midnight.setUTCMinutes(0);
    midnight.setUTCSeconds(0);
    midnight.setUTCMilliseconds(0);
    return midnight;
}

function getDayBefore(date: Date): Date {
    const dayBefore = new Date(date);
    dayBefore.setDate(date.getDate() - 1);
    return dayBefore;
}

function createNewStats(): Stats {
    return {
        totalWins: 0,
        totalLosses: 0,
        totalMistakes: 0,
        winStreak: 0,
        perfectWinStreak: 0,
        lastPlayed: '2023-01-01',
        version: 1,
    };
}

function loadStats(): Stats | null {
    const strStats = localStorage.getItem('stats');
    if (strStats === null) {
        return null;
    }

    return JSON.parse(strStats);
}

function saveStats(stats: Stats) {
    localStorage.setItem('stats', JSON.stringify(stats));
}
