import { useState } from 'react';
import { HexCells } from './HexCells';
import { Homepage } from './Homepage';
import { getDateForTime } from 'src/utils/getDateForTime';

export const ScreenSelector: React.FC = () => {
    const [showGame, setShowGame] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [gameDate] = useState(() => getDateForTime(import.meta.env.VITE_GENERATE_TIME_UTC))
    
    if (showGame) {
        return (
            <HexCells
                date={gameDate}
                showHelp={showHelp}
                setShowHelp={setShowHelp}
            />
        );
    }
    else {
        return (
            <Homepage
                date={gameDate}
                play={() => setShowGame(true)}
                help={() => { setShowHelp(true); setShowGame(true); }}
            />
        );
    }
}