import { StoryObj } from '@storybook/react';
import { Countdown } from './Countdown';

export default {
    title: 'Countdown',
    component: Countdown,
};

type Story = StoryObj<typeof Countdown>;

export const Default: Story = {
    args: {
        endTime: '21:33',
        action: () => alert('done'),
    }
}
