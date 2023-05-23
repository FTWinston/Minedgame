
import { forwardRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Zoom from '@mui/material/Zoom';
import { TransitionProps } from '@mui/material/transitions';
import ShareIcon from '@mui/icons-material/Share';
import { Countdown } from './Countdown';

const SuccessTransition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return (
        <Zoom
            style={{ transitionDelay: '750ms' }}
            ref={ref}
            {...props}
        />
    );
});

const FailureTransition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
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

export const Result: React.FC<Props> = props => {
    const title = props.result === 'success'
        ? 'You win'
        : 'You lose';

    const share = () => {
        let text = `⏱️ ${props.timeSpent}   💡 ${props.hintsUsed}   ❌ ${props.errors}`;
        if (props.result === 'failure') {
            text = `🚩 ${props.bombsLeft}   ${text}`;
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
            TransitionComponent={props.result === 'success' ? SuccessTransition : FailureTransition}
            onContextMenu={e => e.preventDefault()}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Why not share your result with a friend?
                </DialogContentText>
                <DialogContentText>
                    A new game is available every day, so come back tomorrow! Next game in:
                </DialogContentText>
                <Box textAlign="center" m={1}>
                    <Countdown endTime={import.meta.env.VITE_GENERATE_TIME_UTC} action={() => location.reload()} />
                </Box>
                <Box textAlign="center">
                    <Button
                        color="primary"
                        variant="contained"
                        endIcon={<ShareIcon />}
                        onClick={share}
                    >
                        Share
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
