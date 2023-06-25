
import { forwardRef, useMemo } from 'react';
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
import DialogActions from '@mui/material/DialogActions';
import { useOneDayLater } from 'src/hooks/useOneDayLater';
import { shareLoss, shareWin } from 'src/utils/share';
import { updateStats } from 'src/utils/stats';

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
    date: Date;
    result: 'success' | 'failure';
    bombsLeft: number;
    errors: number;
    hintsUsed: number;
    stage: number;
    totalStages: number;
    timeSpent: string;
    retry: () => void;
}

export const Result: React.FC<Props> = props => {
    const { t } = useTranslation();
    const success = props.result === 'success';
    const nextGameDate = useOneDayLater(props.date);

    const gameStats = useMemo(() => updateStats(props.date, success, props.errors, props.hintsUsed), [props.date, success, props.errors, props.hintsUsed]);

    const share = () => success
        ? shareWin(t, props.timeSpent, props.hintsUsed, props.errors, gameStats.winStreak, gameStats.perfectWinStreak)
        : shareLoss(t, props.timeSpent, props.stage, props.bombsLeft);

    const showIgnoringStats = !gameStats.updated && (
        gameStats.winStreak > 1 || (!success && gameStats.winStreak > 0)
    );

    return (
        <Dialog
            open={true}
            TransitionComponent={success ? SuccessTransition : FailureTransition}
        >
            <DialogTitle>
                <Trans i18nKey={success ? 'resultTitleWin' : 'resultTitleLose'} />
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t(success ? 'resultGameSummaryWin' : 'resultGameSummaryLose', {
                        elapsed: props.timeSpent,
                        stage: props.stage,
                        totalStages: props.totalStages,
                        hints: props.hintsUsed,
                        errors: props.errors,
                        remaining: props.bombsLeft
                    })}
                </DialogContentText>
                {showIgnoringStats ? <DialogContentText mt={1}>{t('resultsIgnoringStats')}</DialogContentText> : undefined}
                <DialogContentText mt={1}>
                    {t(gameStats.winStreak > 1 && gameStats.perfectWinStreak === gameStats.winStreak ? 'resultPerfectStreakSummary' : 'resultStreakSummary', {
                        count: gameStats.winStreak,
                        perfect: gameStats.perfectWinStreak,
                    })}
                </DialogContentText>
                <DialogContentText mt={1}>
                    {t('resultNextGame')}
                </DialogContentText>
                <Box textAlign="center" m={1}>
                    <Countdown endDate={nextGameDate} action={() => location.reload()} />
                </Box>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center'}}>
                <Button
                    variant="text"
                    onClick={props.retry}
                >
                    {t('tryAgain')}
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ShareIcon />}
                    onClick={share}
                >
                    {t('share')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
