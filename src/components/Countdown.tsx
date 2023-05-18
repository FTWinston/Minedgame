
import { Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

/** Given a time string (HH:mm format), gets the time value (epoch ms) of the closest future Date at that time. */
function getTimeInFuture(strTime: string): number {
    const strToday = new Date().toISOString().split('T')[0];
    const date = new Date(`${strToday}T${strTime}:00.000+00:00`);

    // If that time TODAY is in the past, add a day.
    if (date < new Date()) {
        date.setDate(date.getDate() + 1);
    }

    return date.getTime();
}

interface Props {
    endTime: string;
    action: () => void;
}

export const Countdown: React.FC<Props> = props => {
    const { endTime, action } = props;
    const endDate = useMemo(() => getTimeInFuture(endTime), [endTime]);
    const [remaining, setRemaining] = useState('');

    useEffect(() => {
        const updateRemaining = () => {
            const remainingMs = Math.max(0, endDate - Date.now());

            if (remainingMs === 0) {
                action();
                clearInterval(interval);
            }

            const msInMinute = 1000 * 60;
            const msInHour = msInMinute * 60;

            const hours = Math.floor(remainingMs / msInHour);
            const minutes = Math.floor((remainingMs % msInHour) / msInMinute);
            const seconds = Math.floor((remainingMs % msInMinute) / 1000);

            const strMinutes = minutes
                .toString()
                .padStart(2, '0');
            const strSeconds = seconds
                .toString()
                .padStart(2, '0');
            setRemaining(`${hours}:${strMinutes}:${strSeconds}`);
        };

        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);
        return () => clearInterval(interval);
    }, [endDate, action]);

    return (
        <Typography
            fontFamily="monospace"
            fontWeight="bold"
            color="secondary"
            fontSize="2em"
        >
            {remaining}
        </Typography>
    )
}
