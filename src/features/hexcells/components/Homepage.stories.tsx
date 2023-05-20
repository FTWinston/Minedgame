import { StoryObj } from '@storybook/react';
import { Homepage } from './Homepage';

export default {
    title: 'Homepage',
    component: Homepage,
};

type Story = StoryObj<typeof Homepage>;

export const Default: Story = {
    args: {
        play: () => {},
        help: () => {},
    },
}
