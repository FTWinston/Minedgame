import { useEffect, useState } from 'react';
import { DisplayCellState, CellSet } from 'src/features/hexcells';

interface Props {
    columns: number;
    duration: number;
    cellSets: Array<Array<DisplayCellState | null>>;
}

export const CyclingCells: React.FC<Props> = props => {
    const { cellSets, duration } = props;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setIndex(index => index < cellSets.length - 1 ? index + 1 : 0), duration);

        return () => clearInterval(interval);
    }, [cellSets, duration]);

    return (
        <CellSet
            cells={cellSets[index]}
            columns={props.columns}
        />
    );
}