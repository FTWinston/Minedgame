import { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme, styled } from '@mui/material/styles';
import { useLongPress } from 'src/hooks/useLongPress';
import { CellType, CountType, RowDirection } from '../types/CellState';
import { isClueType } from '../utils/isClueCell';
import './Cell.css';

export enum Special {
    Highlight = 1,
    Error = 2,
}

interface Props {
    cellType: CellType;
    countType?: CountType;
    direction?: RowDirection;
    number?: number;
    special?: Special;
    resolved?: boolean;
    sx?: SxProps<Theme> | undefined;
    role?: string;
    onClick?: () => void;
    onLongPress?: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const cellWidth = 2.3094;
// eslint-disable-next-line react-refresh/only-export-components
export const cellHeight = 2;

const OuterBorderHexagon = styled(Box,
    { shouldForwardProp: (prop) => prop !== 'cellType' && prop !== 'error' }
)<{ cellType: CellType, error: boolean }>
(({ cellType, error, theme }) => {
    let backgroundColor, cursor;
    switch (cellType) {
        case CellType.RowClue:
            break;
        case CellType.Obscured:
        case CellType.Hint:
            cursor = 'pointer';
        // eslint-disable-next-line no-fallthrough
        default:
            backgroundColor = theme.palette.text.primary;
            break;
    }

    const animationName = error
        ? 'hexCellErrorShake'
        : 'none';
    
    return {
        width: `${cellWidth}em`,
        height: `${cellHeight}em`,
        clipPath: 'polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)',
        backgroundColor,
        cursor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animationDuration: '0.15s',
        animationIterationCount: 3,
        animationName,
    };
});

const InnerFillHexagon = styled(Box,
    { shouldForwardProp: (prop) => prop !== 'cellType' && prop !== 'direction' }
)<{ cellType: CellType, direction?: RowDirection }>
(({ cellType, direction, theme }) => {
    let backgroundColor, color, transform;
    switch (cellType) {
        case CellType.Obscured:
            backgroundColor = theme.palette.warning.main;
            color = backgroundColor;
            break;
        case CellType.Bomb:
            backgroundColor = theme.palette.primary.dark;
            color = backgroundColor;
            break;
        case CellType.AdjacentClue:
            backgroundColor = theme.palette.background.paper;
            color = theme.palette.text.primary;
            break;
        case CellType.Unknown:
            backgroundColor = theme.palette.background.paper;
            color = theme.palette.text.secondary;
            break;
        case CellType.RadiusClue:
            backgroundColor = theme.palette.primary.dark;
            color = theme.palette.text.primary;
            break;
        case CellType.RowClue:
            color = theme.palette.text.primary;
            switch (direction) {
                case RowDirection.TopToBottom:
                    transform = 'translate(0, 0.5em)';
                    break;
                case RowDirection.TLBR:
                    transform = 'rotate(-60deg) translate(0, 0.5em)';
                    break;
                case RowDirection.TRBL:
                    transform = 'rotate(60deg) translate(0, 0.5em)';
                    break;
                case RowDirection.BottomToTop:
                    transform = 'rotate(-180deg) translate(0, 0.5em)';
                    break;
                case RowDirection.BLTR:
                    transform = 'rotate(-120deg) translate(0, 0.5em)';
                    break;
                case RowDirection.BRTL:
                    transform = 'rotate(120deg) translate(0, 0.5em)';
                    break;
            }
            break;
        case CellType.Exploded:
            backgroundColor = theme.palette.error.dark;
            color = backgroundColor;
            break;
        case CellType.Hint:
            backgroundColor = theme.palette.success.main;
            color = theme.palette.text.primary;
            break;
    }
    
    return {
        fontSize: '0.95em',
        width: `${cellWidth}em`,
        height: `${cellHeight}em`,
        clipPath: 'polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)',
        backgroundColor,
        color,
        transform,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.25s, background-color 0.25s',
    }
});

const GlowHexagon = styled(Box,
    { shouldForwardProp: (prop) => prop !== 'cellType' && prop !== 'revealing' }
)<{ cellType: CellType, revealing: boolean }>(({ cellType, revealing }) => {
    let backgroundColor;

    if (cellType !== CellType.RowClue) {
        backgroundColor = revealing
            ? 'rgba(255,255,255, 0.75)'
            : 'rgba(255,255,255, 0.15)';
    }

    return {
        fontSize: '0.85em',
        fontWeight: 'bold',
        width: `${cellWidth}em`,
        height: `${cellHeight}em`,
        clipPath: 'polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        transition: 'background-color 0.5s',
    };
});

const Text = styled(Box,
    { shouldForwardProp: (prop) => prop !== 'cellType' && prop !== 'countType' && prop !== 'fullyResolved' }
)<{ cellType: CellType, countType?: CountType, fullyResolved?: boolean }>(({ cellType, countType, fullyResolved, theme }) => {
    let before, after;

    if (isClueType(cellType)) {
        if (countType === CountType.Contiguous) {
            before = {
                content: '"{"',
                display: 'inline-block',
            };
            after = {
                content: '"}"',
                display: 'inline-block',
            };
        }
        else if (countType === CountType.Split) {
            before = {
                content: '"-"',
                display: 'inline-block',
            };
            after = {
                content: '"-"',
                display: 'inline-block',
            };
        }
    }

    return {
        fontSize: '1.2em',
        color: fullyResolved
            ? theme.palette.text.disabled
            : undefined,
        textDecoration: cellType === CellType.RowClue
            ? 'underline'
            : undefined,
        textDecorationColor: cellType === CellType.RowClue && !fullyResolved
            ? theme.palette.primary.main
            : undefined,
        '&::before': before,
        '&::after': after,
    };
});

export const Cell: React.FC<PropsWithChildren<Props>> = props => {
    let content: React.ReactNode;

    if (props.children) {
        content = props.children;
    }
    else if (isClueType(props.cellType)) {
        content = props.number;
    }
    else if (props.cellType === CellType.Unknown) {
        content = '?';
    }
    else if (props.cellType === CellType.Hint) {
        content = '!';
    }

    const handlers = useLongPress(props.onLongPress, props.onClick);

    return (
        <OuterBorderHexagon
            cellType={props.cellType}
            error={props.special === Special.Error}
            {...handlers}
            sx={props.sx}
            role={props.role}
        >
            <InnerFillHexagon cellType={props.cellType} direction={props.direction}>
                <GlowHexagon cellType={props.cellType} revealing={props.special === Special.Highlight}>
                    <Text cellType={props.cellType} countType={props.countType} fullyResolved={props.resolved}>
                        {content}
                    </Text>
                </GlowHexagon>
            </InnerFillHexagon>
        </OuterBorderHexagon>
    );
}