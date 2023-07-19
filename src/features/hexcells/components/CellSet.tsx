import { CSSProperties } from 'react';
import { styled } from '@mui/material/styles';
import { useCellCascade } from '../hooks/useCellCascade';
import { useTemporaryValue } from 'src/hooks/useTemporaryValue';
import { CellBoardInfo } from '../types/CellBoard';
import { CellType, DisplayCellState } from '../types/CellState';
import { Cell, cellHeight, cellWidth, Special } from './Cell';
import { isObscured } from '../utils/resolved';

interface Props extends Omit<CellBoardInfo, 'numBombs' | 'numErrors' | 'hintsUsed'> {
    onClick?: (cell: DisplayCellState, index: number) => void;
    onLongPress?: (cell: DisplayCellState, index: number) => void;
    revealingIndex?: number;
    highlightIndexes?: number[];
    style?: CSSProperties;
    errorIndex?: number;
}

const gapSize = 0.025;

const CellContainer = styled('ul')({
    display: 'grid',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    gridGap: `${gapSize}em ${gapSize * 2}em`,
    filter: 'drop-shadow(-0.15em 0.125em 0.1em rgba(0, 0, 0, 0.25))',
});

const CellWrapper = styled('li')({
    position: 'relative',
});

export const CellSet: React.FC<Props> = props => {
    const { columns, cells, onClick, onLongPress } = props;
    const rows = Math.ceil(cells.length / columns);

    const explodedIndex = cells.findIndex(cell => cell?.type === CellType.Exploded);
    const explosionCascadeCells = useCellCascade(explodedIndex, columns, rows);

    const errorIndex = useTemporaryValue(props.errorIndex, undefined, 500);

    const contents = cells.map((cell, index) => {
        if (cell === null) {
            return null;
        }

        let row = Math.floor(index / columns) * 2 + 1;
        let col = (index % columns);

        if (col % 2 === 0) {
            row += 1;
        }
        col = col * 2 + 1;

        const wrapperStyle: React.CSSProperties = {
            gridColumn: `${col} / span 3`,
            gridRow: `${row} / span 2`,
        };

        const special = errorIndex === index
            ? Special.Error
            : cell.type === CellType.Obscured && props.revealingIndex === index || props.highlightIndexes?.includes(index)
                ? Special.Highlight
                : undefined;
        
        return (
            <CellWrapper key={index} style={wrapperStyle}>
                <Cell
                    cellType={explosionCascadeCells.has(index) && cell.type !== CellType.RowClue ? CellType.Exploded : cell.type}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolved={(cell as any).resolved}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    countType={(cell as any).countType}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    direction={(cell as any).direction}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    number={(cell as any).number}
                    special={special}
                    onClick={onClick ? () => onClick(cell, index) : undefined}
                    onLongPress={onLongPress && isObscured(cell) ? () => onLongPress(cell, index) : undefined}
                />
            </CellWrapper>
        )
    });

    const containerStyle: React.CSSProperties = {
        ...props.style,
        gridTemplateColumns: `repeat(${columns}, ${cellWidth * 0.25 + gapSize * 0.5}em ${cellWidth * 0.5 + gapSize}em ) ${cellWidth * 0.25 + gapSize * 0.5}em`,
        gridTemplateRows: `repeat(${rows * 2}, ${cellHeight / 2 + gapSize}em)`,
    };

    return (
        <CellContainer style={containerStyle}>
            {contents}
        </CellContainer>
    );
}