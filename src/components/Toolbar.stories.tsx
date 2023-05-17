import { StoryObj } from '@storybook/react';
import { Toolbar } from './Toolbar';

export default {
    title: 'Toolbar',
    component: Toolbar,
};

type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
    args: {
        bombsLeft: 10,
        errors: 7,
        hintsUsed: 3,
        timeSpent: '0:07',
        board: 1,
        numBoards: 3,
    }
}
