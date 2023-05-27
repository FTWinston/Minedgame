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

const Row = styled(Box)({
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const TopRow = styled(Row)({
    top: 0,
});

const BottomRow = styled(Row)({
    bottom: 0,
});

const Number = styled(Typography)({
    fontSize: 'inherit !important',
});

const BorderlessChip = styled(Chip)({
    border: 'none',
    fontSize: '2.25em',
    padding: '24px 8px',
    fontFamily: 'monospace',
});

const Stage = styled(BorderlessChip)({
    position: 'relative',
    top: '-0.1rem',
    '& > .MuiChip-label': {
        marginLeft: '0.275em',
        marginTop: '0.1rem',
    }
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
            <BottomRow>
                <BorderlessChip
                    color="primary"
                    variant="outlined"
                    icon={<BombIcon fontSize="large" />}
                    label={props.bombsLeft.toString()}
                    title={t('bombsLeft')}
                />

                <Hint
                    color="success"
                    variant="outlined"
                    startIcon={<BigHintIcon />}
                    endIcon={props.hintsUsed > 0 ? <Number>({props.hintsUsed})</Number> : undefined}
                    onClick={props.getHint}
                    title={t('hintDesc')}
                >
                    {t('hint')}
                </Hint>

                <BorderlessChip
                    color="error"
                    disabled={props.errors === 0}
                    variant="outlined"
                    icon={<ErrorIcon fontSize="large" />}
                    label={props.errors}
                    title={t('errors')}
                />
            </BottomRow>

            <TopRow>
                <BorderlessChip
                    color="secondary"
                    variant="outlined"
                    icon={<TimeIcon fontSize="large" />}
                    label={props.timeSpent}
                    title={t('elapsed')}
                />

                <Stage
                    color="secondary"
                    variant="outlined"
                    icon={<StageIcon fontSize="large" />}
                    label={t('stageNumber', { current: props.currentStage, total: props.totalStages })}
                    title={t('currentStage')}
                />
    
                <IconButton
                    color="secondary"
                    title={t('help')}
                    size="large"
                    onClick={props.showHelp}
                >
                    <HelpIcon fontSize="inherit" />
                </IconButton>
            </TopRow>
        </>
    );
}
