import { StoryObj } from '@storybook/react';
import { CellType, CountType, RowDirection } from '../types/CellState';
import { Cell, Special } from './Cell';

export default {
    title: 'Sensors/Cell',
    component: Cell,
};

type Story = StoryObj<typeof Cell>;

export const Obscured: Story = {
    args: {
        cellType: CellType.Obscured
    }
}

export const Bomb: Story = {
    args: {
        cellType: CellType.Bomb
    }
}

export const Revealing: Story = {
    args: {
        cellType: CellType.Obscured,
        special: Special.Revealing,
    }
}

export const Error: Story = {
    args: {
        cellType: CellType.Obscured,
        special: Special.Error,
    }
}

export const Unknown: Story = {
    args: {
        cellType: CellType.Unknown
    }
}

export const Zero: Story = {
    args: {
        cellType: CellType.Empty,
        countType: CountType.Normal,
        number: 0,
    }
}

export const Three: Story = {
    args: {
        cellType: CellType.Empty,
        countType: CountType.Normal,
        number: 3,
    }
}

export const Split: Story = {
    args: {
        cellType: CellType.Empty,
        countType: CountType.Split,
        number: 3,
    }
}

export const Contiguous: Story = {
    args: {
        cellType: CellType.Empty,
        countType: CountType.Contiguous,
        number: 3,
    }
}

export const DoubleRadius: Story = {
    args: {
        cellType: CellType.RadiusClue,
        countType: CountType.Normal,
        number: 3,
    }
}

export const RowTopToBottom: Story = {
    args: {
        cellType: CellType.RowClue,
        direction: RowDirection.TopToBottom,
        countType: CountType.Contiguous,
        number: 3,
    }
}

export const RowBottomToTop: Story = {
    args: {
        cellType: CellType.RowClue,
        direction: RowDirection.BottomToTop,
        countType: CountType.Normal,
        number: 3,
    }
}

export const RowTLBR: Story = {
    args: {
        cellType: CellType.RowClue,
        direction: RowDirection.TLBR,
        countType: CountType.Split,
        number: 3,
    }
}

export const RowTRBL: Story = {
    args: {
        cellType: CellType.RowClue,
        direction: RowDirection.TRBL,
        countType: CountType.Split,
        number: 3,
    }
}

export const RowBLTR: Story = {
    args: {
        cellType: CellType.RowClue,
        direction: RowDirection.BLTR,
        countType: CountType.Split,
        number: 3,
    }
}

export const RowBRTL: Story = {
    args: {
        cellType: CellType.RowClue,
        direction: RowDirection.BRTL,
        countType: CountType.Split,
        number: 3,
    }
}

export const Exploded: Story = {
    args: {
        cellType: CellType.Exploded,
    }
}

export const Hint: Story = {
    args: {
        cellType: CellType.Hint,
    }
}
