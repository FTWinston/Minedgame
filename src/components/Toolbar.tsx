import { Box, Button, Typography, styled} from 'src/lib/mui';
import BombIcon from '@mui/icons-material/FlagOutlined';
import TimeIcon from '@mui/icons-material/TimerOutlined';
import HintIcon from '@mui/icons-material/QuestionMark';
import ErrorIcon from '@mui/icons-material/ReportOutlined';

interface Props {
    bombsLeft: number;
    errors: number;
    hintsUsed: number;
    timeSpent: string;
    getHint?: () => void;
}

const Root = styled(Box)({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
});

const Number = styled(Typography)({
    fontWeight: 'bold',
    fontSize: 'inherit',
})

export const Toolbar: React.FC<Props> = props => {
    const bombs = <Number>{props.bombsLeft}</Number>
    const hints = <Number>{props.hintsUsed}</Number>
    const errors = <Number>{props.errors}</Number>

    return (
        <Root>
            <Button
                color="primary"
                variant="text"
                startIcon={bombs}
                endIcon={<BombIcon />}
            >
                Remaining
            </Button>

            <Button
                color="warning"
                variant="text"
                startIcon={<TimeIcon />}
            >
                {props.timeSpent}
            </Button>

            <Button
                color="success"
                variant="outlined"
                startIcon={hints}
                endIcon={<HintIcon />}
                onClick={props.getHint}
            >
                Hint
            </Button>

            <Button
                color="error"
                variant="text"
                startIcon={errors}
                endIcon={<ErrorIcon />}
            >
                Errors
            </Button>
        </Root>
    );
}
