import { useEffect, useState } from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { Homepage } from './Homepage';
import { getDateForTime } from 'src/utils/getDateForTime';

// Lazy load the HexCells component, so the home page shows (slightly) quicker.
// But preload it, so that we don't slow down the initial navigation.
const HexCells = lazyWithPreload(() => import('./HexCells'));

export const ScreenSelector: React.FC = () => {
    const [showGame, setShowGame] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [gameDate] = useState(() => getDateForTime(import.meta.env.VITE_GENERATE_TIME_UTC))
    
    useEffect(() => { HexCells.preload() }, []);

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