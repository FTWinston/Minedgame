import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import BombIcon from '@mui/icons-material/FlagOutlined';
import TimeIcon from '@mui/icons-material/TimerOutlined';
import HelpIcon from '@mui/icons-material/HelpOutline';
import HintIcon from '@mui/icons-material/Lightbulb';
import ErrorIcon from '@mui/icons-material/DangerousOutlined';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

interface Props {
    bombsLeft: number;
    errors: number;
    hintsUsed: number;
    timeSpent: string;
    board: number;
    numBoards: number;
    getHint?: () => void;
    showHelp?: () => void;
}

const Number = styled(Typography)({
    fontSize: 'inherit !important',
});

const BorderlessChip = styled(Chip)({
    border: 'none',
    padding: '24px 8px',
    '& .MuiChip-label': {
        fontSize: '18px',
    }
});

const Remaining = styled(BorderlessChip)({
    position: 'absolute',
    bottom: 0,
    left: 0,
});

const Elapsed = styled(BorderlessChip)({
    position: 'absolute',
    top: 0,
    left: 0,
});

const Help = styled(IconButton)({
    position: 'absolute',
    top: 0,
    right: 0,
});

const Errors = styled(BorderlessChip)({
    position: 'absolute',
    bottom: 0,
    right: 0,
});

const HintWrapper = styled(Box)({
    position: 'absolute',
    bottom: '8px',
    left: 0,
    right: 0,
    textAlign: 'center',
});

export const Tools: React.FC<Props> = props => {
    return (
        <>
            <Remaining
                color="primary"
                variant="outlined"
                icon={<BombIcon />}
                label={props.bombsLeft.toString()}
                title="Number of bombs remaining"
            />

            <Elapsed
                color="secondary"
                variant="outlined"
                icon={<TimeIcon />}
                label={props.timeSpent}
                title="Elapsed time"
            />

            <Help
                color="secondary"
                title="Help"
                onClick={props.showHelp}
            >
                <HelpIcon />
            </Help>

            <HintWrapper>
            <Button
                color="success"
                variant="text"
                startIcon={<HintIcon />}
                endIcon={props.hintsUsed > 0 ? <Number>({props.hintsUsed})</Number> : undefined}
                onClick={props.getHint}
                title="Highlights a cell that can be solved"
            >
                Hint
            </Button>
            </HintWrapper>

            <Errors
                color="error"
                variant="outlined"
                icon={<ErrorIcon />}
                label={props.errors}
                title="Number of errors made"
            />
        </>
    );
}
