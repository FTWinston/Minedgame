import { getRandomInt } from './random';

export function shuffle(items: unknown[]) {
    let currentIndex = items.length;
    let temporaryValue: unknown;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = getRandomInt(currentIndex);
        currentIndex -= 1;
  
        // And swap it with the current element.
        temporaryValue = items[currentIndex];
        items[currentIndex] = items[randomIndex];
        items[randomIndex] = temporaryValue;
    }
}