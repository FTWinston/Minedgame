import { Cell, CellType } from '../features/hexcells';
import { Box } from 'src/lib/mui';
import './Indicator.css';

interface Props {
    type: CellType;
    spin: boolean;
}

const spinSx = {
    animationDuration: '3s',
    animationIterationCount: 'infinite',
    animationName: 'loaderSpin',
    width: '100vw',
};

export const Indicator: React.FC<Props> = props => (
    <Box
        sx={props.spin ? spinSx : undefined}
        fontSize="20vmin"
        display="flex"
        justifyContent="center"
    >
        <Cell cellType={props.type} />
    </Box>
);
