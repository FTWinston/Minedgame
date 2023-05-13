import { Cell, CellType } from './features/hexcells';
import { Box } from 'src/lib/mui';
import './Spinner.css';

export const Spinner: React.FC = () => (
    <Box sx={{    
        animationDuration: '3s',
        animationIterationCount: 'infinite',
        animationName: 'loaderSpin',
        width: '100vw',
    }}
        fontSize="20vmin"
        display="flex"
        justifyContent="center"
    >
        <Cell cellType={CellType.Obscured} />
    </Box>
);
