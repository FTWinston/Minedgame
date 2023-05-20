import { useState } from 'react';
import { HexCells } from './HexCells';
import { Homepage } from './Homepage';

export const ScreenSelector: React.FC = () => {
    const [showGame, setShowGame] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    
    if (showGame) {
        return (
            <HexCells
                showHelp={showHelp}
                setShowHelp={setShowHelp}
            />
        );
    }
    else {
        return (
            <Homepage
                play={() => setShowGame(true)}
                help={() => { setShowHelp(true); setShowGame(true); }}
            />
        );
    }
}