import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { CellBoardInfo } from '../types/CellBoard';
import { cellHeight } from './Cell';
import { isObscured } from '../utils/resolved';
import { isClueCell } from '../utils/isClueCell';
import { CellSet } from './CellSet';

interface Props extends Omit<CellBoardInfo, 'numBombs' | 'numErrors' | 'hintsUsed'> {
    revealCell: (index: number) => void;
    flagCell: (index: number) => void;
    errorIndex?: number;
}

const gapSize = 0.025;

const Root = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100svh',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem 0 3rem 0',
    userSelect: 'none',
});

export const InteractiveCells: React.FC<Props> = props => {
    const { columns, cells } = props;
    const rows = Math.ceil(cells.length / columns);

    const [revealingIndex, setRevealingIndex] = useState<number | undefined>(undefined);
    const [highlightIndexes, setHighlightIndexes] = useState<number[]>([]);

    const cellSizeLimitByWidth = `calc(100vw / ${columns * 1.94})`;
    const cellSizeLimitByHeight = `calc((100svh - 5rem) / ${rows - 0.25} / ${cellHeight + gapSize})`;
    const containerStyle: React.CSSProperties = {
        fontSize: `min(${cellSizeLimitByWidth}, ${cellSizeLimitByHeight}, 20rem)`,
    };

    return (
        <Root>
            <CellSet
                columns={columns}
                cells={cells}
                style={containerStyle}
                errorIndex={props.errorIndex}
                highlightIndexes={highlightIndexes}
                revealingIndex={revealingIndex}
                onClick={(cell, index) => {
                    if (isObscured(cell) && !props.result) {
                        setRevealingIndex(index);
                        props.revealCell(index);
                    }
                    if (isClueCell(cell)) {
                        setHighlightIndexes(highlightIndexes === cell.targetIndexes ? [] : cell.targetIndexes);
                    }
                }}
                onLongPress={(cell, index) => {
                    if (isObscured(cell) && !props.result) {
                        setRevealingIndex(index);
                        props.flagCell(index);
                    }
                }}
            />
        </Root>
    );
}