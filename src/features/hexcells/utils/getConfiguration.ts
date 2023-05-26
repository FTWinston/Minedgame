import { getRandomFloat, getRandomInt } from 'src/utils/random';
import { GenerationConfig } from './generateBoard';

export function getConfiguration(): GenerationConfig {
    const config: Required<GenerationConfig> = {
        orientation: 'portrait',
        numCells: 50,
        gapFraction: getRandomFloat(0.08, 0.45),
        bombFraction: getRandomFloat(0.3, 0.7),
        
        contiguousClueChance: getRandomFloat(0.25, 1),
        splitClueChance: getRandomFloat(0.2, 0.8),
        rowClueChance: getRandomFloat(1, 4),
        radiusClueChance: getRandomFloat(0.0125, 0.05),

        revealChance: getRandomFloat(0.05, 0.2),
        unknownFraction: getRandomFloat(0.025, 0.1),

        remainingBombCountFraction: 0.1, // TODO: Use a higher number for more challenging boards.
    };

    // Increase the value of one clue type signficantly. (Or don't, for a more evenly-spread board.)
    switch (getRandomInt(6)) {
        case 0:
            config.contiguousClueChance *= 20;
            break;
        case 1:
            config.splitClueChance *= 20;
            break;
        case 2:
            config.rowClueChance *= 20;
            break;
        case 3:
            config.radiusClueChance *= 20;
            break;
        case 4:
            config.revealChance *= 5;
            break;
    }

    // Increase the value of a random clue type somewhat, twice. (Or don't!)
    for (let i=0; i<2; i++) {
        switch (getRandomInt(9)) {
            case 0:
                config.contiguousClueChance *= 5;
                break;
            case 1:
                config.splitClueChance *= 5;
                break;
            case 2:
                config.rowClueChance *= 5;
                break;
            case 3:
                config.radiusClueChance *= 5;
                break;
            case 4:
                config.revealChance *= 2;
                break;
            case 5:
                config.unknownFraction *= 2;
                break;
        }
    }

    return config;
}