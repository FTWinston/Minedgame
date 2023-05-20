import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
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
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="90svh">
            <Typography variant="h1" color={theme.palette.text.primary}>Minedgame</Typography>
            <Typography variant="h4" component="h2" color={theme.palette.text.secondary}>A daily minesweeping puzzle</Typography>

            <Box margin="2em" display="flex" gap="1em">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={props.play}
                >
                    Play
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.help}
                >
                    How to play
                </Button>
            </Box>

            <Typography color={theme.palette.text.secondary}>{strDate}</Typography>
        </Box>
    )
}