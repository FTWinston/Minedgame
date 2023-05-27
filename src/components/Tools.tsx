import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import BombIcon from '@mui/icons-material/FlagOutlined';
import TimeIcon from '@mui/icons-material/TimerOutlined';
import HelpIcon from '@mui/icons-material/HelpOutline';
import HintIcon from '@mui/icons-material/Lightbulb';
import ErrorIcon from '@mui/icons-material/DangerousOutlined';
import StageIcon from '@mui/icons-material/AutoStories';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

interface Props {
    bombsLeft: number;
    errors: number;
    hintsUsed: number;
    timeSpent: string;
    currentStage: number;
    totalStages: number;
    getHint?: () => void;
    showHelp?: () => void;
}

const Number = styled(Typography)({
    fontSize: 'inherit !important',
});

const BorderlessChip = styled(Chip)({
    border: 'none',
    fontSize: '2.25em',
    padding: '24px 8px',
    fontFamily: 'monospace',
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

const Stage = styled(BorderlessChip)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    '& > .MuiChip-label': {
        marginLeft: '0.275em',
        marginTop: '0.1em',
    }
});

const HintWrapper = styled(Box)({
    position: 'absolute',
    bottom: '0',
    left: 0,
    right: 0,
    textAlign: 'center',
});

const Hint = styled(Button)({
    fontSize: '1.25em',
});

const BigHintIcon = styled(HintIcon)({
    fontSize: '1.5em !important',
})

export const Tools: React.FC<Props> = props => {
    const { t } = useTranslation();

    return (
        <>
            <Remaining
                color="primary"
                variant="outlined"
                icon={<BombIcon fontSize="large" />}
                label={props.bombsLeft.toString()}
                title={t('bombsLeft')}
            />

            <Stage
                color="secondary"
                variant="outlined"
                icon={<StageIcon fontSize="large" />}
                label={t('stageNumber', { current: props.currentStage, total: props.totalStages })}
                title={t('currentStage')}
            />

            <Elapsed
                color="secondary"
                variant="outlined"
                icon={<TimeIcon fontSize="large" />}
                label={props.timeSpent}
                title={t('elapsed')}
            />

            <Help
                color="secondary"
                title={t('help')}
                size="large"
                onClick={props.showHelp}
            >
                <HelpIcon fontSize="inherit" />
            </Help>

            <HintWrapper>
                <Hint
                    color="success"
                    variant="text"
                    startIcon={<BigHintIcon />}
                    endIcon={props.hintsUsed > 0 ? <Number>({props.hintsUsed})</Number> : undefined}
                    onClick={props.getHint}
                    title={t('hintDesc')}
                >
                    {t('hint')}
                </Hint>
            </HintWrapper>

            <Errors
                color="error"
                disabled={props.errors === 0}
                variant="outlined"
                icon={<ErrorIcon fontSize="large" />}
                label={props.errors}
                title={t('errors')}
            />
        </>
    );
}
