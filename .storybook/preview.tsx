import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../src/theme';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600&display=swap" rel="stylesheet"></link>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
