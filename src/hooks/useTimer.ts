import { useEffect, useState } from 'react';

interface TimeValue {
    minutes: number,
    seconds: number,
    display: string,
}

export function useTimer() {
    const [{ display }, setTime] = useState<TimeValue>({
        minutes: 0,
        seconds: 0,
        display: '0:00',
    });
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (!enabled) {
            return;
        }
        const interval = setInterval(() => {
            setTime(time => {
                let seconds = time.seconds + 1;
                let minutes = time.minutes;
                while (seconds >= 60) {
                    seconds = seconds - 60;
                    minutes = minutes + 1;
                }
                return {
                    minutes,
                    seconds,
                    display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [enabled])

    return {
        display,
        enabled,
        setEnabled,
    };
}