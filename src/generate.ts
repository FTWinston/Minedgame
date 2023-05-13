import { GenerationConfig, generateBoard } from 'src/features/hexcells/utils/generateBoard';
import { writeFile } from 'fs';

const config: GenerationConfig = {
    orientation: 'landscape',
    numCells: 50,
    gapFraction: 0.3,
    bombFraction: 0.45,
    unknownFraction: 0.05,
    rowClueChance: 5,
    radiusClueChance: 0.025,
    revealChance: 0.1,
    contiguousClueChance: 0.5,
    splitClueChance: 0.4,
    remainingBombCountFraction: 0.33,
};

const definition = JSON.stringify(generateBoard(config));

writeFile('public/game.json', definition, err => {
    if (err) {
      console.error(err);
    }

    // Otherwise, file written successfully
});