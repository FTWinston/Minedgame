import { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme, styled } from '@mui/material/styles';
import { useLongPress } from 'src/hooks/useLongPress';
import { CellType, CountType, RowDirection } from '../types/CellState';
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

export const cellWidth = 2.3094;
export const cellHeight = 2;

const OuterBorderHexagon = styled(Box,
    { shouldForwardProp: (prop) => prop !== 'state' && prop !== 'error' })
    <{ state: CellType, error: boolean }>
(({ state, error, theme }) => {
    let backgroundColor, cursor;
    switch (state) {
        case CellType.RowClue:
            break;
        case CellType.Obscured:
        case CellType.Hint:
            cursor = 'pointer';
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
    { shouldForwardProp: (prop) => prop !== 'state' && prop !== 'fullyResolved' && prop !== 'countType' })
    <{ state: CellType, fullyResolved?: boolean, direction?: RowDirection }>
(({ state, fullyResolved, direction, theme }) => {
    let backgroundColor, color, transform;
    switch (state) {
        case CellType.Obscured:
            backgroundColor = theme.palette.warning.main;
            color = backgroundColor;
            break;
        case CellType.Bomb:
            backgroundColor = theme.palette.primary.dark;
            color = backgroundColor;
            break;
        case CellType.Empty:
            backgroundColor = theme.palette.background.paper;
            color = fullyResolved
                ? theme.palette.text.disabled
                : theme.palette.text.primary;
            break;
        case CellType.Unknown:
            backgroundColor = theme.palette.background.paper;
            color = theme.palette.text.secondary;
            break;
        case CellType.RadiusClue:
            backgroundColor = theme.palette.primary.dark;
            color = fullyResolved
                ? theme.palette.text.disabled
                : theme.palette.text.primary;
            break;
        case CellType.RowClue:
            color = fullyResolved
                ? theme.palette.text.disabled
                : theme.palette.text.primary;
            switch (direction) {
                case RowDirection.TopToBottom:
                    transform = 'translate(0, 0.6em)';
                    break;
                case RowDirection.TLBR:
                    transform = 'rotate(-60deg) translate(0, 0.6em)';
                    break;
                case RowDirection.TRBL:
                    transform = 'rotate(60deg) translate(0, 0.6em)';
                    break;
                case RowDirection.BottomToTop:
                    transform = 'rotate(-180deg) translate(0, 0.6em)';
                    break;
                case RowDirection.BLTR:
                    transform = 'rotate(-120deg) translate(0, 0.6em)';
                    break;
                case RowDirection.BRTL:
                    transform = 'rotate(120deg) translate(0, 0.6em)';
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
    { shouldForwardProp: (prop) => prop !== 'state' && prop !== 'revealing' })<{ state: CellType, revealing: boolean }>(({ state, revealing }) => {
    let backgroundColor;

    if (state !== CellType.RowClue) {
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

const Text = styled(Box)({
    fontSize: '1.2em',
})

export const Cell: React.FC<PropsWithChildren<Props>> = props => {
    let content;

    switch (props.cellType) {
        case CellType.Empty:
        case CellType.RowClue:
        case CellType.RadiusClue:
            switch (props.countType) {
                case CountType.Split:
                    content = `-${props.number}-`;
                    break;
                case CountType.Contiguous:
                    content = `{${props.number}}`;
                    break;
                case CountType.Normal:
                default:
                    content = props.number;
                    break;
            }
            break;
        case CellType.Unknown:
            content = '?';
            break;
        case CellType.Hint:
            content = '!';
            break;
    }

    if (props.children) {
        content = props.children;
    }

    const handlers = useLongPress(props.onLongPress, props.onClick);

    return (
        <OuterBorderHexagon
            state={props.cellType}
            error={props.special === Special.Error}
            {...handlers}
            sx={props.sx}
            role={props.role}
        >
            <InnerFillHexagon state={props.cellType} fullyResolved={props.resolved} direction={props.direction}>
                <GlowHexagon state={props.cellType} revealing={props.special === Special.Highlight}>
                    <Text>
                        {content}
                    </Text>
                </GlowHexagon>
            </InnerFillHexagon>
        </OuterBorderHexagon>
    );
}