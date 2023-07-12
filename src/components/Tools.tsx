import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import BombIcon from '@mui/icons-material/FlagOutlined';
import HelpIcon from '@mui/icons-material/HelpOutline';
import HintIcon from '@mui/icons-material/Lightbulb';
import ErrorIcon from '@mui/icons-material/DangerousOutlined';
import StageIcon from '@mui/icons-material/AutoStories';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';

interface Props {
    bombsLeft: number;
    errors: number;
    hintsUsed: number;
    currentStage: number;
    totalStages: number;
    getHint?: () => void;
    showHelp?: () => void;
}

const Row = styled(Box)({
    position: 'fixed',
    left: 0,
    display: 'flex',
    overflowY: 'hidden',
    overflowX: 'auto',
    maxWidth: '100vw',
});

const RowContent = styled(Box)({
    minWidth: '100vw',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const TopRow = styled(Row)({
    top: 0,
});

const BottomRow = styled(Row)({
    bottom: 0,
});

const CenteredBadge = styled(Badge)({
    '& > .MuiBadge-badge': {
        top: '40%', 
        right: '51%',
        backgroundColor: 'transparent',
    },
});

const BorderlessChip = styled(Chip)({
    border: 'none',
    fontSize: 'min(7.5vw, 2.25em)',
    padding: '24px 8px',
    fontFamily: 'monospace',
    '& > .MuiChip-label': {
        minWidth: '2.25em',
    },
});

const Stage = styled(BorderlessChip)({
    position: 'relative',
    top: '-0.1rem',
    '& > .MuiChip-label': {
        marginLeft: '0.275em',
        marginTop: '0.1rem',
    },
});

const Hint = styled(Button)({
    fontSize: 'min(7.5vw, 1.25em)',
    borderBottomWidth: '0 !important',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexShrink: 0,
});

const BigHintIcon = styled(HintIcon)({
    fontSize: '1.5em !important',
})

export const Tools: React.FC<Props> = props => {
    const { t } = useTranslation();

    return (
        <>
            <BottomRow>
                <RowContent>
                    <Tooltip describeChild title={t('bombsLeft')}>
                        <BorderlessChip
                            color="primary"
                            variant="outlined"
                            icon={<BombIcon fontSize="large" />}
                            label={props.bombsLeft.toString()}
                        />
                    </Tooltip>

                    <Tooltip describeChild title={t('hintDesc')}>
                        <Hint
                            color="success"
                            variant="outlined"
                            startIcon={
                                <CenteredBadge
                                    badgeContent={props.hintsUsed}
                                    color="success"
                                >
                                    <BigHintIcon />
                                </CenteredBadge>
                            }
                            onClick={props.getHint}
                        >
                            {t('hint')}
                        </Hint>
                    </Tooltip>

                    <Tooltip describeChild title={t('errors')}>
                        <span>
                            <BorderlessChip
                                color="error"
                                disabled={props.errors === 0}
                                variant="outlined"
                                icon={<ErrorIcon fontSize="large" />}
                                label={props.errors}
                            />
                        </span>
                    </Tooltip>
                </RowContent>
            </BottomRow>

            <TopRow>
                <RowContent>
                    <Tooltip describeChild title={t('currentStage', { current: props.currentStage, total: props.totalStages })}>
                        <Stage
                            color="secondary"
                            variant="outlined"
                            icon={<StageIcon fontSize="large" />}
                            label={<>{props.currentStage}<Typography component="span" fontSize="0.75em"> / </Typography>{props.totalStages}</>}
                        />
                    </Tooltip>
        
                    <Tooltip describeChild title={t('help')}>
                        <IconButton
                            color="secondary"
                            size="large"
                            onClick={props.showHelp}
                        >
                            <HelpIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </RowContent>
            </TopRow>
        </>
    );
}
