import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { DialogContent } from '@mui/material';

interface Props {
    open: boolean
    close: () => void;
}

export const Help: React.FC<Props> = props => (
    <Dialog
        fullScreen
        open={props.open}
        onClose={props.close}
    >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
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
            <Typography mt={2}>
                A <strong>basic clue</strong> shows the number of bombs in adjacent cells.
            </Typography>
            <Typography mt={2}>
                A <strong>contiguous clue</strong> is shown between curly brackets: this indicates that associated bombs are adjacent to each other.
            </Typography>
            <Typography mt={2}>
                A <strong>split clue</strong> is shown between dashes: this indicates that associated bombs are not all adjacent to each other.
            </Typography>
            <Typography mt={2}>
                A number not contained in a cell is a <strong>row clue</strong>. This shows the number of bombs along a line to the edge of the board.
            </Typography>
            <Typography mt={2}>
                A number in a blue cell is an <strong>area clue</strong>. This shows the number of bombs within a two-cell radius.
            </Typography>
            <Typography mt={2}>
                Tap or click on any clue to highlight its associated cells.
            </Typography>
        </DialogContent>
    </Dialog>
);