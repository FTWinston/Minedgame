
import { forwardRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
import Zoom from '@mui/material/Zoom';
import { TransitionProps } from '@mui/material/transitions';
import ShareIcon from '@mui/icons-material/Share';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return (
        <Zoom
            style={{ transitionDelay: '3000ms' }}
            ref={ref}
            {...props}
        />
    );
});

interface Props {
    result: 'success' | 'failure';
    bombsLeft: number;
    errors: number;
    hintsUsed: number;
    timeSpent: string;
}

const ResultBox = styled(Box)<{ result: 'success' | 'failure' }>(({ theme, result }) => {
    const applyWidthTo = result === 'success'
        ? '& > :first-child' // 3 elements, size the first one
        : '& > *'; // 4 elements, size them all

    return {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            flexWrap: 'wrap',
            [applyWidthTo]: {
                minWidth: result === 'success' ? '90%' : '35%',
            },
        },
    };
})

const BorderlessChip = styled(Chip)({
    border: 'none',
    fontSize: '1.75em',
    padding: '24px 8px',
});

const ButtonWrapper = styled(DialogContent)({
    display: 'flex',
    justifyContent: 'space-evenly',
});

export const Result: React.FC<Props> = props => {
    const title = props.result === 'success'
        ? 'You win'
        : 'You lose';

    const remaining = props.bombsLeft === 0
        ? undefined
        : (
            <BorderlessChip
                color="primary"
                variant="outlined"
                icon={<BombIcon fontSize="large" />}
                label={props.bombsLeft.toString()}
                title="Number of bombs remaining"
            />
        )

    const share = () => {
        let text = `⏱️ ${props.timeSpent}   💡 ${props.hintsUsed}   ❌ ${props.errors}`;
        if (props.result === 'failure') {
            text = `🏴 ${props.bombsLeft}   ${text}`;
        }
        const title = props.result === 'success'
            ? 'I won at Minedgame'
            : 'I lost at Minedgame';
        text = `${title} \n${text}\n`;

        navigator.share({
            title,
            text,
            url: document.location.href,
        });
    }

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Your game statistics are shown below.
                </DialogContentText>
                <DialogContentText>
                    Come back tomorrow, when a new game will be available!
                </DialogContentText>
            </DialogContent>
            <ResultBox result={props.result}>
                {remaining}

                <BorderlessChip
                    color="secondary"
                    className="time"
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
            </ResultBox>
            <ButtonWrapper>
                <Button
                    color="primary"
                    variant="contained"
                    endIcon={<ShareIcon />}
                    onClick={share}
                >
                    Share
                </Button>
            </ButtonWrapper>
        </Dialog>
    );
}
