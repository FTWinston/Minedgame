import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { CyclingCells } from './CyclingCells';
import { CellType } from 'src/features/hexcells';
import { CountType } from 'src/features/hexcells/types/CellState';

interface Props {
    open: boolean
    close: () => void;
}

const ParagraphSet = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'stretch',
    gap: 3,
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
}));

const Paragraph = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexBasis: 0,
    flexGrow: 1,
    gap: '1em',
});

const ParagraphText = styled(Box)({
    flexGrow: 1,
    alignSelf: 'stretch',
});

export const Help: React.FC<Props> = props => {
    // No transition time if showing immediately on mount.
    const [transitionProps, setTransitionProps] = useState<TransitionProps | undefined>({ timeout: 0 });
    useEffect(() => setTransitionProps(undefined), []);

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.close}
            TransitionProps={transitionProps}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography sx={{ flex: 1 }} variant="h6" component="div">
                        How to play
                    </Typography>
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
                <Typography>
                    Minedgame is a logic puzzle involving hexagonal cells.<br/>
                    Some cells contain bombs, the rest contain clues.<br/>
                    Most cells start obscured: you don't know what they contain.
                </Typography>
                <Typography mt={2}>
                    Tap or left click on an obscured cell to reveal its content. If it contains a clue, this will show. If it contains a bomb, you lose!<br/>
                    Long press or right click on a cell to flag it as a bomb. if it doesn't contain a bomb, this counts as an error.
                </Typography>
                <Typography mt={2}>
                    The number of bombs remaining is shown in the bottom left of the screen. You win when this reaches zero.<br/>
                    You should never have to guess: it should always be possible to determine next move logically.
                </Typography>
                <Typography mt={2}>
                    If you are stuck, the <em>hint</em> button will indicate a cell that you should be able to determine the state of. It won't indicate whether this cell contains a bomb.
                </Typography>
                
                <ParagraphSet mt={2}>
                    <Paragraph>
                        <ParagraphText>A <strong>basic clue</strong> shows the number of bombs in adjacent cells.</ParagraphText>

                        <CyclingCells
                            columns={3}
                            duration={1500}
                            cellSets={[
                                [
                                    { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                    { type: CellType.Obscured }, { type: CellType.Empty, countType: CountType.Normal, number: 0, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                    null, { type: CellType.Obscured }, null
                                ],
                                [
                                    { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                    { type: CellType.Obscured }, { type: CellType.Empty, countType: CountType.Normal, number: 1, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                    null, { type: CellType.Obscured }, null
                                ],
                                [
                                    { type: CellType.Bomb }, { type: CellType.Bomb }, { type: CellType.Obscured },
                                    { type: CellType.Obscured }, { type: CellType.Empty, countType: CountType.Normal, number: 2, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                    null, { type: CellType.Obscured }, null
                                ],
                                [
                                    { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                    { type: CellType.Obscured }, { type: CellType.Empty, countType: CountType.Normal, number: 3, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                    null, { type: CellType.Bomb }, null
                                ],
                                [
                                    { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.Bomb },
                                    { type: CellType.Bomb }, { type: CellType.Empty, countType: CountType.Normal, number: 4, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                    null, { type: CellType.Bomb }, null
                                ],
                            ]}
                        />
                    </Paragraph>
                    <Paragraph>
                        <ParagraphText>A <strong>contiguous clue</strong> is shown between curly brackets: this indicates that associated bombs are adjacent to each other.</ParagraphText>
                        
                        <CyclingCells
                            columns={3}
                            duration={1500}
                            cellSets={[
                                [
                                    { type: CellType.Bomb }, { type: CellType.Bomb }, { type: CellType.Obscured },
                                    { type: CellType.Obscured }, { type: CellType.Empty, countType: CountType.Contiguous, number: 2, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                    null, { type: CellType.Obscured }, null
                                ],
                                [
                                    { type: CellType.Obscured }, { type: CellType.Bomb }, { type: CellType.Bomb },
                                    { type: CellType.Obscured }, { type: CellType.Empty, countType: CountType.Contiguous, number: 3, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                    null, { type: CellType.Obscured }, null
                                ],
                                [
                                    { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                    { type: CellType.Bomb }, { type: CellType.Empty, countType: CountType.Contiguous, number: 4, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                    null, { type: CellType.Bomb }, null
                                ],
                            ]}
                        />
                    </Paragraph>
                    <Paragraph>
                        <ParagraphText>A <strong>split clue</strong> is shown between dashes: this indicates that associated bombs are not all adjacent to each other.</ParagraphText>
                        
                        <CyclingCells
                            columns={3}
                            duration={1500}
                            cellSets={[
                                [
                                    { type: CellType.Obscured }, { type: CellType.Obscured }, { type: CellType.Obscured },
                                    { type: CellType.Bomb }, { type: CellType.Empty, countType: CountType.Split, number: 2, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                    null, { type: CellType.Obscured }, null
                                ],
                                [
                                    { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                    { type: CellType.Obscured }, { type: CellType.Empty, countType: CountType.Split, number: 3, resolved: false, targetIndexes: [], }, { type: CellType.Obscured },
                                    null, { type: CellType.Bomb }, null
                                ],
                                [
                                    { type: CellType.Bomb }, { type: CellType.Obscured }, { type: CellType.Bomb },
                                    { type: CellType.Bomb }, { type: CellType.Empty, countType: CountType.Split, number: 4, resolved: false, targetIndexes: [], }, { type: CellType.Bomb },
                                    null, { type: CellType.Obscured }, null
                                ],
                            ]}
                        />
                    </Paragraph>
                </ParagraphSet>

                <ParagraphSet mt={2}>
                    <Paragraph>
                        <ParagraphText>
                            A number not contained in a cell is a <strong>row clue</strong>. This shows the number of bombs along a line to the edge of the board.
                        </ParagraphText>
                    </Paragraph>
                    <Paragraph>
                        <ParagraphText>
                            A number in a blue cell is an <strong>area clue</strong>. This shows the number of bombs within a two-cell radius.
                        </ParagraphText>
                    </Paragraph>
                </ParagraphSet>
                <Typography mt={2}>
                    Tap or click on any clue to highlight its associated cells.
                </Typography>
            </DialogContent>
        </Dialog>
    );
}