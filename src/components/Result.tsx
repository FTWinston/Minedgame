
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
import { Trans, useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const title = t(props.result === 'success' ? 'win' : 'lose');

    const share = () => {
        let text = `⏱️ ${props.timeSpent}   💡 ${props.hintsUsed}   ❌ ${props.errors}`;
        if (props.result === 'failure') {
            text = `🚩 ${props.bombsLeft}   ${text}`;
        }
        const title = t(props.result === 'success' ? 'shareWin' : 'shareLose');
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
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Trans i18nKey="resultPrompt" />
                </DialogContentText>
                <DialogContentText>
                    <Trans i18nKey="resultNextGame" />
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
                        {t('share')}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
