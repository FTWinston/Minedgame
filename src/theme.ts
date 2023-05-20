import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        error: {
            main: '#f44336',
            dark: '#d32f2f',
            light: '#e57373',
            contrastText: '#000',
        },
    },
    typography: {
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
});