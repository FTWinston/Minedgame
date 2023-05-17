import { styled } from '@mui/material/styles';
import BombIcon from '@mui/icons-material/FlagOutlined';
import TimeIcon from '@mui/icons-material/TimerOutlined';
import HintIcon from '@mui/icons-material/Lightbulb';
import ErrorIcon from '@mui/icons-material/DangerousOutlined';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';

interface Props {
    result: 'success' | 'failure';
    bombsLeft: number;
    errors: number;
    hintsUsed: number;
    timeSpent: string;
}

const BorderlessChip = styled(Chip)({
    border: 'none',
    fontSize: '1.75em',
    padding: '24px 8px',
});

export const Result: React.FC<Props> = props => {
    const title = props.result === 'success'
        ? 'You win'
        : 'You lose';

    return (
        <Dialog open={true}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Your game statistics are shown below.
                </DialogContentText>
                <DialogContentText>
                    Come back tomorrow, when a new game will be available!
                </DialogContentText>
                    <Box display="flex" justifyContent="center">
                        <BorderlessChip
                            color="primary"
                            variant="outlined"
                            icon={<BombIcon fontSize="large" />}
                            label={props.bombsLeft.toString()}
                            title="Number of bombs remaining"
                        />

                        <BorderlessChip
                            color="secondary"
                            variant="outlined"
                            icon={<TimeIcon fontSize="large" />}
                            label={props.timeSpent}
                            title="Elapsed time"
                        />

                        <BorderlessChip
                            color="success"
                            variant="outlined"
                            icon={<HintIcon />}
                            label={props.hintsUsed.toString()}
                            title="Hints used"
                        />

                        <BorderlessChip
                            color="error"
                            variant="outlined"
                            icon={<ErrorIcon fontSize="large" />}
                            label={props.errors}
                            title="Number of errors made"
                        />
                    </Box>
            </DialogContent>
        </Dialog>
    );
}
