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
    breakpoints: {
        values: {
            xs: 300,
            sm: 400,
            md: 500,
            lg: 600,
            xl: 900,
        },
    },
});