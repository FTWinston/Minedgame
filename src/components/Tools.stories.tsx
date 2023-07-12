import { StoryObj } from '@storybook/react';
import { Tools } from './Tools';

export default {
    title: 'Tools',
    component: Tools,
};

type Story = StoryObj<typeof Tools>;

export const Default: Story = {
    args: {
        bombsLeft: 10,
        errors: 7,
        hintsUsed: 3,
        currentStage: 1,
        totalStages: 2,
    }
}
