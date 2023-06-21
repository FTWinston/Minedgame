import { TFunction } from 'i18next';
import { StatsOutput } from './stats';

export function shareWin(
    t: TFunction<'translation', undefined, 'translation'>,
    stats: StatsOutput,
    timeSpent: string,
    hintsUsed: number,
    errors: number
) {
    const text = `⏱️ ${timeSpent}   💡 ${hintsUsed}   ❌ ${errors}`;
    
    const title = t('shareWin');

    share(title, text);
}

export function shareLoss(
    t: TFunction<'translation', undefined, 'translation'>,
    stats: StatsOutput,
    timeSpent: string,
    stage: number,
    bombsLeft: number,
) {
    const text = `⏱️ ${timeSpent}   🚩 ${bombsLeft}   📖 ${stage}`;

    const title = t('shareLoss');
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