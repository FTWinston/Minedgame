import { StoryObj } from '@storybook/react';
import { Result } from './Result';

export default {
    title: 'Result',
    component: Result,
};

type Story = StoryObj<typeof Result>;

export const Success: Story = {
    args: {
        result: 'success',
        bombsLeft: 0,
        errors: 0,
        hintsUsed: 3,
        timeSpent: '0:07',
    }
}

export const Failure: Story = {
    args: {
        result: 'failure',
        bombsLeft: 10,
        errors: 7,
        hintsUsed: 0,
        timeSpent: '0:07',
    }
}
