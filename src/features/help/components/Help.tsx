import { PropsWithChildren, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { CyclingCells } from './CyclingCells';
import { Cell, CellType } from 'src/features/hexcells';
import { CountType, RowDirection } from 'src/features/hexcells/types/CellState';
import { Link } from '@mui/material';

interface Props {
    open: boolean
    close: () => void;
}

const Page = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '1.5em',
    '&:not([hidden])': {
        minHeight: '21.5em',
    },
});

interface TabPageProps {
    index: number;
    currentIndex: number;
}

const TabPage: React.FC<PropsWithChildren<TabPageProps>> = props => (
    <Page
        role="tabpanel" 
        hidden={props.currentIndex !== props.index}
        id={`help-tabpanel-${props.index}`}
        aria-labelledby={`help-tab-${props.index}`}
    >
        {props.currentIndex === props.index && props.children}
    </Page>
)

const Group = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'stretch',
    gap: '3em',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '1.5em',
        borderBottomColor: theme.palette.text.disabled,
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        paddingBottom: '1.5em',
    },
}));

const Section = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexBasis: 0,
    flexGrow: 1,
    gap: '0.5em',
    [theme.breakpoints.down('md')]: {
        borderTopColor: theme.palette.text.disabled,
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        paddingTop: '1em',
    }
}));

const Paragraph = styled(Box, 
    { shouldForwardProp: (prop) => prop !== 'grow' }
)<{ grow?: boolean }>(({ grow }) => ({
    alignSelf: 'stretch',
    flexGrow: grow ? 1 : undefined,
}));


const NextButton = styled(Button)({
    alignSelf: 'center',
    marginTop: '1em',
});

export const Help: React.FC<Props> = props => {
    // No transition time if showing immediately on mount.
    const [transitionProps, setTransitionProps] = useState<TransitionProps | undefined>({ timeout: 0 });
    useEffect(() => setTransitionProps(undefined), []);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    
    const [tab, setTab] = useState(0);
    const { t } = useTranslation();

    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            TransitionProps={transitionProps}
            fullWidth
            fullScreen={fullScreen}
            maxWidth="lg"
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Tabs value={tab} sx={{ flex: 1 }} onChange={(_e, val) => setTab(val)} centered>
                        <Tab label={t('helpTab1')} id="help-tab-0" aria-controls="help-tabpanel-0" />
                        <Tab label={t('helpTab2')} id="help-tab-1" aria-controls="help-tabpanel-1" />
                        <Tab label={t('helpTab3')} id="help-tab-2" aria-controls="help-tabpanel-2" />
                    </Tabs>
                    
                    <IconButton
                        autoFocus
                        edge="end"
                        color="inherit"
                        onClick={props.close}
                        aria-label={t('close')}
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            
            <DialogContent>
                <TabPage index={0} currentIndex={tab}>
                    <Paragraph>
                        <Trans
                            i18nKey="help1-1"
                            components={{
                                Link: <Link href="https://store.steampowered.com/app/265890/Hexcells/" />
                            }}
                        />
                    </Paragraph>
                    <Group>
                        <Section>
                            <Cell cellType={CellType.Obscured} />
                            <Paragraph><Trans i18nKey="help1-2-1a" /></Paragraph>
                            <Paragraph><Trans i18nKey="help1-2-1b" /></Paragraph>
                        </Section>
                        <Section>
                            <Cell cellType={CellType.Bomb} />
                            <Paragraph><Trans i18nKey="help1-2-2a" /></Paragraph>
                            <Paragraph><Trans i18nKey="help1-2-2b" /></Paragraph>
                        </Section>
                        <Section>
                            <Cell cellType={CellType.AdjacentClue} countType={CountType.Normal} number={3} />
                            <Paragraph><Trans i18nKey="help1-2-3a" /></Paragraph>
                            <Paragraph><Trans i18nKey="help1-2-3b" /></Paragraph>
                        </Section>
                    </Group>

                    <Paragraph><Trans i18nKey="help1-3" /></Paragraph>
                    <Paragraph><Trans i18nKey="help1-4" /></Paragraph>
                    <NextButton variant="outlined" onClick={() => setTab(1)}>{t('next')}</NextButton>
                </TabPage>

                <TabPage index={1} currentIndex={tab}>
                    <Paragraph><Trans i18nKey="help2-1" /></Paragraph>
                    <Group>
                        <Section>
                            <Paragraph grow><Trans i18nKey="help2-2-1" /></Paragraph>

                            <CyclingCells
                                columns={3}
                                duration={1500}
                                cellSets={[
                                    [
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.AdjacentClue, countType: CountType.Normal, number: 0, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                        null, { type: CellType.Obscured }, null
                                    ],
                                    [
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                        { type: CellType.Obscured }, { type: CellType.AdjacentClue, countType: CountType.Normal, number: 1, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                        null, { type: CellType.Obscured }, null
                                    ],
                                    [
                                        { type: CellType.Bomb }, { type: CellType.Bomb }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.AdjacentClue, countType: CountType.Normal, number: 2, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                        null, { type: CellType.Obscured }, null
                                    ],
                                    [
                                        { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.AdjacentClue, countType: CountType.Normal, number: 3, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                        null, { type: CellType.Bomb }, null
                                    ],
                                    [
                                        { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.Bomb },
                                        { type: CellType.Bomb }, { type: CellType.AdjacentClue, countType: CountType.Normal, number: 4, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                        null, { type: CellType.Bomb }, null
                                    ],
                                ]}
                            />
                        </Section>
                        <Section>
                            <Paragraph grow><Trans i18nKey="help2-2-2" /></Paragraph>
                            
                            <CyclingCells
                                columns={3}
                                duration={1500}
                                cellSets={[
                                    [
                                        { type: CellType.Bomb }, { type: CellType.Bomb }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.AdjacentClue, countType: CountType.Contiguous, number: 2, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                        null, { type: CellType.Obscured }, null
                                    ],
                                    [
                                        { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.Bomb },
                                        { type: CellType.Obscured }, { type: CellType.AdjacentClue, countType: CountType.Contiguous, number: 3, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                        null, { type: CellType.Obscured }, null
                                    ],
                                    [
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                        { type: CellType.Bomb }, { type: CellType.AdjacentClue, countType: CountType.Contiguous, number: 4, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                        null, { type: CellType.Bomb }, null
                                    ],
                                ]}
                            />
                        </Section>
                        <Section>
                            <Paragraph grow><Trans i18nKey="help2-2-3" /></Paragraph>
                            
                            <CyclingCells
                                columns={3}
                                duration={1500}
                                cellSets={[
                                    [
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        { type: CellType.Bomb }, { type: CellType.AdjacentClue, countType: CountType.Split, number: 2, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                        null, { type: CellType.Obscured }, null
                                    ],
                                    [
                                        { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                        { type: CellType.Obscured }, { type: CellType.AdjacentClue, countType: CountType.Split, number: 3, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                        null, { type: CellType.Bomb }, null
                                    ],
                                    [
                                        { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                        { type: CellType.Bomb }, { type: CellType.AdjacentClue, countType: CountType.Split, number: 4, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                        null, { type: CellType.Obscured }, null
                                    ],
                                ]}
                            />
                        </Section>
                    </Group>
                    <Paragraph><Trans i18nKey="help2-3" /></Paragraph>

                    <NextButton variant="outlined" onClick={() => setTab(2)}>{t('next')}</NextButton>
                </TabPage>

                <TabPage index={2} currentIndex={tab}>
                    <Paragraph><Trans i18nKey="help3-1" /></Paragraph>
                    <Group>
                        <Section>
                            <Paragraph grow><Trans i18nKey="help3-2-1" /></Paragraph>
                            
                            <CyclingCells
                                columns={3}
                                duration={1500}
                                cellSets={[
                                    [
                                        { type: CellType.RowClue, countType: CountType.Normal, direction: RowDirection.TLBR, number: 1, targetIndexes: [], resolved: false, }, null, { type: CellType.Obscured },
                                        { type: CellType.Bomb }, { type: CellType.Obscured, }, { type: CellType.Bomb },
                                        null, { type: CellType.Bomb }, { type: CellType.Obscured, }
                                    ],
                                    [
                                        null, { type: CellType.RowClue, countType: CountType.Normal, direction: RowDirection.TopToBottom, number: 1, targetIndexes: [], resolved: false, }, { type: CellType.Obscured },
                                        { type: CellType.Bomb }, { type: CellType.Obscured, }, { type: CellType.Bomb },
                                        null, { type: CellType.Bomb }, { type: CellType.Obscured, }
                                    ],
                                    [
                                        null, null, { type: CellType.Obscured },
                                        { type: CellType.Bomb }, { type: CellType.Obscured, }, { type: CellType.Bomb },
                                        { type: CellType.RowClue, countType: CountType.Normal, direction: RowDirection.BLTR, number: 2, targetIndexes: [], resolved: false, }, { type: CellType.Bomb }, { type: CellType.Obscured, }
                                    ],
                                    [
                                        null, null, { type: CellType.Obscured },
                                        { type: CellType.Bomb }, { type: CellType.Obscured, }, { type: CellType.Bomb },
                                        { type: CellType.RowClue, countType: CountType.Normal, direction: RowDirection.BottomToTop, number: 1, targetIndexes: [], resolved: false, }, { type: CellType.Bomb }, { type: CellType.Obscured, }
                                    ],
                                ]}
                            />
                        </Section>
                        <Section>
                            <Paragraph grow><Trans i18nKey="help3-2-2" /></Paragraph>
                            
                            <CyclingCells
                                columns={5}
                                duration={1500}
                                cellSets={[
                                    [
                                        null, null, { type: CellType.Obscured }, null, null,
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.RadiusClue, countType: CountType.Normal, number: 1, targetIndexes: [], resolved: false }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        null, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, null,
                                    ],
                                    [
                                        null, null, { type: CellType.Bomb }, null, null,
                                        { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.RadiusClue, countType: CountType.Normal, number: 3, targetIndexes: [], resolved: false }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        null, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, null,
                                    ],
                                    [
                                        null, null, { type: CellType.Obscured }, null, null,
                                        { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.Obscured },
                                        { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.RadiusClue, countType: CountType.Normal, number: 5, targetIndexes: [], resolved: false }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                        { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.Obscured },
                                        null, { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Bomb }, null,
                                    ],
                                ]}
                            />
                        </Section>
                    </Group>
                    <Paragraph><Trans i18nKey="help3-3" /></Paragraph>

                    <NextButton variant="outlined" onClick={props.close}>{t('done')}</NextButton>
                </TabPage>
            </DialogContent>
        </Dialog>
    );
}