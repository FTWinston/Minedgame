import { useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { CellBoardInfo } from '../types/CellBoard';
import { CellType } from '../types/CellState';
import { isObscured } from '../utils/resolved';
import { isClueCell } from '../utils/isClueCell';
import { cellHeight } from './Cell';
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
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem 0 3rem 0',
    userSelect: 'none',
});

interface Focus {
    index: number;
    targetIndexes: number[]
}

export const InteractiveCells: React.FC<Props> = props => {
    const { columns, cells } = props;

    const [revealingIndex, setRevealingIndex] = useState<number | undefined>(undefined);
    const [focus, setFocus] = useState<Focus>();

    // When a cell has just been flagged or revealed,
    // and that cell is a target of the focused cell,
    // and no other target cells of the focused cell are obscured,
    // then clear the focus.
    const checkClearFocus = (index: number) => {
        if (focus
            && focus.targetIndexes.includes(index)
            && focus.targetIndexes.every(
                    targetIndex => targetIndex === index
                || cells[targetIndex]?.type !== CellType.Obscured)
        ) {
                setFocus(undefined);
        }
    }

    const rows = Math.ceil(cells.length / columns);
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
                highlightIndexes={focus?.targetIndexes}
                revealingIndex={revealingIndex}
                onClick={(cell, index) => {
                    if (isObscured(cell) && !props.result) {
                        setRevealingIndex(index);
                        props.revealCell(index);
                        checkClearFocus(index);
                    }
                    if (isClueCell(cell)) {
                        setFocus(
                            focus?.index === index
                                ? undefined
                                : {
                                    index,
                                    targetIndexes: cell.targetIndexes,
                                }
                        );
                    }
                }}
                onLongPress={(cell, index) => {
                    if (isObscured(cell) && !props.result) {
                        setRevealingIndex(index);
                        props.flagCell(index);
                        checkClearFocus(index);
                    }
                }}
            />
        </Root>
    );
}