import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import AlreadyPlayedIcon from '@mui/icons-material/TaskAlt';
import { useTranslation } from 'react-i18next';
import { Cell } from 'src/features/hexcells/components/Cell';
import { CellType } from 'src/features/hexcells/types/CellState';
import { hasPlayedDate } from 'src/utils/stats';
import { Tooltip } from './Tooltip';

interface Props {
    date: Date;
    play: () => void;
    help: () => void;
}

const AlreadyPlayed = styled(AlreadyPlayedIcon)({
    position: 'absolute',
    right: '-1.25em',
})

export const Homepage: React.FC<Props> = props => {
    const theme = useTheme();
    const { t } = useTranslation();
    const alreadyPlayed = hasPlayedDate(props.date)
        ? (
            <Tooltip title={t('alreadyPlayed')}>
                <AlreadyPlayed color="secondary" />
            </Tooltip>
        )
        : undefined;
    
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center"
            position="fixed" top={0} left={0} right={0} bottom={0}
            minHeight="90svh" gap="1.5em"
        >
            <Typography
                fontFamily="Rajdhani"
                variant="h1"
                fontSize="min(6em, 15vw)"
                color={theme.palette.text.primary}
                display="flex"
                alignItems="center"
                gap="0.15em"
                marginBottom="-1.5rem"
            >
                <Cell
                    cellType={CellType.Obscured}
                    role="none"
                    sx={{
                        fontSize: '0.325em',
                        cursor: 'default',
                        marginBottom: '0.2em',
                    }}
                />
                {t('title')}
            </Typography>

            <Typography
                variant="h4"
                component="h2"
                fontSize="min(2.125em, 5.5vw)"
                color={theme.palette.text.secondary}
                textAlign="center"
            >
                {t('subtitle')}
            </Typography>

            <Box display="flex" gap="1em">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={props.play}
                >
                    {t('play')}
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={props.help}
                >
                    {t('help')}
                </Button>
            </Box>

            <Typography color={theme.palette.text.secondary} position="relative">
                {new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(props.date)}
                {alreadyPlayed}
            </Typography>
            
            <Tooltip title={t('githubLink')} >
                <Link href="https://github.com/FTWinston/Minedgame" target="_blank">
                    <svg aria-hidden viewBox="0 0 16 16" width="32" height="32">
                        <path fill={theme.palette.text.primary} d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                    </svg>
                </Link>
            </Tooltip>
        </Box>
    )
}