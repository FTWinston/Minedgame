import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { HexCells } from './HexCells'
import { GenerationConfig, generateBoard } from './features/hexcells/utils/generateBoard';
import { ThemeProvider, theme } from 'src/lib/mui';

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <HexCells definition={generateBoard(config)} />
        </ThemeProvider>
    </React.StrictMode>,
)
