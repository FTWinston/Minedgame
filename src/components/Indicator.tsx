import Box from '@mui/material/Box';
import { Cell } from '../features/hexcells/components/Cell';
import { CellType } from '../features/hexcells/types/CellState';
import './Indicator.css';

interface Props {
    type: CellType;
    spin: boolean;
    text?: string;
}

const spinSx = {
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: 'loaderSpin',
};

export const Indicator: React.FC<Props> = props => {
    const content = props.text
        ? (
            <Box sx={{fontSize: '0.45em', color: '#633'}}>{props.text}</Box>
        )
        : undefined;

    return (
        <Box
            sx={props.spin ? spinSx : undefined}
            fontSize="20vmin"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100vw"
            height="100svh"
        >
            <Cell cellType={props.type}>
                {content}
            </Cell>
        </Box>
    );
}
