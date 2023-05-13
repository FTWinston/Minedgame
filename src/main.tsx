import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { HexCells } from './HexCells'
import { ThemeProvider, theme } from 'src/lib/mui';

const gameResponse = await fetch('game.json');
const game = await gameResponse.json();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <HexCells definition={game} />
        </ThemeProvider>
    </React.StrictMode>,
)
