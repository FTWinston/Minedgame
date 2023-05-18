import Box from '@mui/material/Box';
import { Cell, CellType } from '../features/hexcells';
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
    width: '100vw',
};

const fixedSx = {
    width: '100vw',
};

export const Indicator: React.FC<Props> = props => {
    const content = props.text
        ? (
            <Box sx={{fontSize: '0.45em', color: '#633'}}>{props.text}</Box>
        )
        : undefined;

    return (
        <Box
            sx={props.spin ? spinSx : fixedSx}
            fontSize="20vmin"
            display="flex"
            justifyContent="center"
        >
            <Cell cellType={props.type}>
                {content}
            </Cell>
        </Box>
    );
}