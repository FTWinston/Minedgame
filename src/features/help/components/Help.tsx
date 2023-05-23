import { PropsWithChildren, useEffect, useState } from 'react';
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
import { CyclingCells } from './CyclingCells';
import { Cell, CellType } from 'src/features/hexcells';
import { CountType, RowDirection } from 'src/features/hexcells/types/CellState';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';

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
                        <Tab label="Overview" id="help-tab-0" aria-controls="help-tabpanel-0" />
                        <Tab label="Clues" id="help-tab-1" aria-controls="help-tabpanel-1" />
                        <Tab label="Advanced" id="help-tab-2" aria-controls="help-tabpanel-2" />
                    </Tabs>
                    
                    <IconButton
                        autoFocus
                        edge="end"
                        color="inherit"
                        onClick={props.close}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            
            <DialogContent>
                <TabPage index={0} currentIndex={tab}>
                    <Paragraph>
                        Minedgame is a logic puzzle involving hexagonal cells. Your goal is flag all of the cells that contain bombs, using clues in the other cells.
                    </Paragraph>
                    <Group>
                        <Section>
                            <Cell cellType={CellType.Obscured} />
                            <Paragraph>
                                This is an obscured cell. Most cells start like this: You don't yet know if it contains a bomb, or a clue.
                            </Paragraph>
                            <Paragraph>
                                Tap or left click on an obscured cell to reveal its content. If it contains a clue, this will show. If it contains a bomb, you lose!
                            </Paragraph>
                        </Section>
                        <Section>
                            <Cell cellType={CellType.Bomb} />
                            <Paragraph>This is a bomb. When a cell is flagged as containing a bomb, it looks like this.</Paragraph>
                            <Paragraph>
                                Long press or right click on an obscured cell to flag it as a bomb. If it doesn't contain a bomb, this counts as an error.
                            </Paragraph>
                        </Section>
                        <Section>
                            <Cell cellType={CellType.AdjacentClue} countType={CountType.Normal} number={3} />
                            <Paragraph>This is a clue. (This one indicates that 3 of its adjacent cells contain bombs.)</Paragraph>
                            <Paragraph>The number of un-flagged is shown in the bottom left of the screen. You win when this number reaches zero.</Paragraph>
                        </Section>
                    </Group>

                    <Paragraph>
                        <em>You should never have to guess</em>: it should always be possible to determine next move logically.
                    </Paragraph>
                    <Paragraph>
                        If you are stuck, the <strong>hint</strong> button will indicate a cell that you should be able to determine the state of. It won't indicate whether this cell contains a bomb.
                    </Paragraph>

                    <NextButton variant="outlined" onClick={() => setTab(1)}>Next</NextButton>
                </TabPage>

                <TabPage index={1} currentIndex={tab}>
                    <Paragraph>
                        There are several different types of clue. Some examples of these are shown below.
                    </Paragraph>
                    <Group>
                        <Section>
                            <Paragraph grow>A <strong>basic clue</strong> shows the number of bombs in adjacent cells.</Paragraph>

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
                            <Paragraph grow>A <strong>contiguous clue</strong> is shown between curly brackets: this indicates that associated bombs are adjacent to each other.</Paragraph>
                            
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
                            <Paragraph grow>A <strong>split clue</strong> is shown between dashes: this indicates that associated bombs are not all adjacent to each other.</Paragraph>
                            
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
                    <Paragraph>
                        A clue will fade to grey when all of its associated cells have been revealed or flagged.
                    </Paragraph>

                    <NextButton variant="outlined" onClick={() => setTab(2)}>Next</NextButton>
                </TabPage>

                <TabPage index={2} currentIndex={tab}>
                    <Paragraph>
                        Other types of clue relate to different cells, but they behave in a similar manner.
                    </Paragraph>
                    <Group>
                        <Section>
                            <Paragraph grow>
                                A number not contained in a cell is a <strong>row clue</strong>.
                                This shows the number of bombs along a line.
                                The number is rotated to indicate the line's direction, and the line always continues to the edge of the board, even when there are gaps between cells.<br/>
                                (The line is always "down" from the angle of the number.)
                            </Paragraph>
                            
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
                            <Paragraph grow>
                                A number in a blue cell is an <strong>area clue</strong>. This shows the number of bombs within a two-cell radius.
                            </Paragraph>
                            
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
                    <Paragraph>
                        Sometimes it isn't obvious which cells are associated with a clue. Tap or click on any clue to highlight its associated cells.
                    </Paragraph>

                    <NextButton variant="outlined" onClick={props.close}>Done</NextButton>
                </TabPage>
            </DialogContent>
        </Dialog>
    );
}