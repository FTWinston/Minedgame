import { TFunction } from 'i18next';

export function shareWin(
    t: TFunction<'translation', undefined, 'translation'>,
    timeSpent: string,
    hintsUsed: number,
    errors: number,
    winStreak: number,
    perfectStreak: number,
) {
    const title = t('shareWin');
    let text = t('shareWinDetail', { timeSpent, hintsUsed, errors });

    if (winStreak > 1) {
        const streakText = perfectStreak === winStreak
            ? t('shareStreakPerfect', { count: winStreak })
            : t('shareStreak', { streak: winStreak, count: perfectStreak });

        text = `${text} \n${streakText}`;
    }

    share(title, text);
}

export function shareLoss(
    t: TFunction<'translation', undefined, 'translation'>,
    timeSpent: string,
    stage: number,
    bombsLeft: number,
) {
    const title = t('shareLoss');
    const text = t('shareLossDetail', { timeSpent, stage, bombsLeft });

    share(title, text);    
}

function share(title: string, text: string) {
    text = `${title} \n${text}\n`;

    navigator.share({
        title,
        text,
        url: document.location.href,
    });
}