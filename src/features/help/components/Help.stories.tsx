import { StoryObj } from '@storybook/react';
import { Help } from './Help';

export default {
    title: 'Help',
    component: Help,
};

type Story = StoryObj<typeof Help>;

export const Default: Story = {
    args: {
        open: true,
        close: () => {},
    },
}
