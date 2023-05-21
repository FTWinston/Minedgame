import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Cell, CellType } from 'src/features/hexcells';
import { getDateForTime } from 'src/utils/getDateForTime';

interface Props {
    play: () => void;
    help: () => void;
}

export const Homepage: React.FC<Props> = props => {
    const theme = useTheme();
    
    const date = getDateForTime(import.meta.env.VITE_GENERATE_TIME_UTC, false);
    const strDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(date);
    
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="90svh" gap="0.5em">
            <Typography
                fontFamily="Rajdhani"
                variant="h1"
                fontSize="min(6em, 15vw)"
                color={theme.palette.text.primary}
                display="flex"
                alignItems="center"
                gap="0.15em"
            >
                <Cell
                    cellType={CellType.Obscured}
                    role="none"
                    sx={{
                        fontSize: '0.325em',
                        cursor: 'default',
                        marginBottom: '0.2em',
                    }}
                />
                Minedgame
            </Typography>

            <Typography
                variant="h4"
                component="h2"
                fontSize="min(2.125em, 5.5vw)"
                color={theme.palette.text.secondary}
                textAlign="center"
            >
                A daily minesweeping puzzle
            </Typography>

            <Box margin="2em" display="flex" gap="1em">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={props.play}
                >
                    Play
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={props.help}
                >
                    How to play
                </Button>
            </Box>

            <Typography color={theme.palette.text.secondary}>{strDate}</Typography>
        </Box>
    )
}