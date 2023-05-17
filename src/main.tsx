import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HexCells } from 'src/components/HexCells'
import { Indicator } from 'src/components/Indicator';
import { CellType } from 'src/features/hexcells';
import { theme } from './theme';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <ErrorBoundary fallback={<Indicator type={CellType.Bomb} spin={false} text="ERROR" />}>
                <Suspense fallback={<Indicator type={CellType.Obscured} spin={true} />}>
                    <HexCells />
                </Suspense>
            </ErrorBoundary>
        </ThemeProvider>
    </React.StrictMode>,
)
