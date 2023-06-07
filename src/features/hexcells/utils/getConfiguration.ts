import { Random } from 'src/utils/random';
import { GenerationConfig } from './generateBoard';

export function getConfiguration(): GenerationConfig {
    const random = new Random();

    const config: Omit<Required<GenerationConfig>, 'seed'> = {
        orientation: 'portrait',
        numCells: 50,
        gapFraction: random.getFloat(0.08, 0.45),
        bombFraction: random.getFloat(0.35, 0.65),
        
        contiguousClueChance: random.getFloat(0.25, 1),
        splitClueChance: random.getFloat(0.2, 0.8),
        rowClueChance: random.getFloat(1, 4),
        radiusClueChance: random.getFloat(0.0125, 0.05),

        revealChance: random.getFloat(0.05, 0.2),
        unknownFraction: random.getFloat(0.025, 0.1),

        remainingBombCountFraction: 0.1, // TODO: Use a higher number for more challenging boards.
    };

    // Increase the value of one clue type signficantly. (Or don't, for a more evenly-spread board.)
    switch (random.getInt(6)) {
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
        switch (random.getInt(9)) {
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