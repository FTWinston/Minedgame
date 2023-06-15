import { StoryObj } from '@storybook/react';
import { Countdown } from './Countdown';

export default {
    title: 'Countdown',
    component: Countdown,
};

type Story = StoryObj<typeof Countdown>;

const endDate = new Date();
endDate.setDate(endDate.getDate() + 1);
endDate.setHours(4);

export const Default: Story = {
    args: {
        endDate,
        action: () => alert('done'),
    }
}
