import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { HexCells } from './HexCells'
import { ThemeProvider, theme } from 'src/lib/mui';
import { Spinner } from './Spinner';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Spinner />}>
                <HexCells />
            </Suspense>
        </ThemeProvider>
    </React.StrictMode>,
)
