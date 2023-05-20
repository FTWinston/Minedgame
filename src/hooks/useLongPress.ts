import { useRef, useMemo } from 'react';
import { TouchEvents } from 'src/types/TouchEvents';
import { distanceSq, Vector2D } from 'src/types/Vector2D';

const delay = 400;

export const clickMoveLimit = 20;

const maxDistSq = clickMoveLimit * clickMoveLimit;

export function useLongPress(
    onLongPress?: (clientPosition: Vector2D) => void,
    onClick?: (clientPosition: Vector2D) => void,
    extraHandlers?: TouchEvents,
): TouchEvents {
    const timeout = useRef<number>();
    const startPos = useRef<Vector2D>();
    const latestPos = useRef<Vector2D>();

    const results = useMemo(
        () => {
            const start = (event: any, x: number, y: number) => {
                event.persist();
    
                startPos.current = latestPos.current = { x, y };
    
                timeout.current = setTimeout(() => {
                    if (onLongPress && distanceSq(latestPos.current!, startPos.current!) < maxDistSq) {
                        window.navigator.vibrate?.(50);
                        onLongPress(startPos.current!);
                    }
                    
                    startPos.current = latestPos.current = undefined;
                    timeout.current = undefined;
                }, delay) as unknown as number;
            };

            const clear = (shouldTriggerClick = true) => {
                if (timeout.current) {
                    clearTimeout(timeout.current);
                    timeout.current = undefined;
                    
                    if (shouldTriggerClick && onClick && distanceSq(latestPos.current!, startPos.current!) < maxDistSq) {
                        onClick(startPos.current!);
                    }
                    
                    timeout.current = undefined;
                }
    
                startPos.current = latestPos.current = undefined;
            };

            const move = (x: number, y: number) => {
                if (startPos.current) {
                    latestPos.current = {
                        x,
                        y,
                    };
                }
            };

            const extra = extraHandlers ?? {};

            return {
                onTouchStart: (e: React.TouchEvent<Element>) => {
                    if (e.touches.length < 2) {
                        const touch = e.touches[0];
                        start(e, touch.pageX, touch.pageY);
                    }
                    extra.onTouchStart?.(e);
                },
                onMouseUp: (e: React.MouseEvent<Element, MouseEvent>) => {
                    if (e.button === 0) {
                        onClick?.({ x: e.pageX, y: e.pageY });
                    }
                    else if (e.button === 2) {
                        onLongPress?.({ x: e.pageX, y: e.pageY });
                    }
                    extra.onMouseUp?.(e);
                },
                onMouseLeave: (e: React.MouseEvent<Element, MouseEvent>) => {
                    clear(false)
                    extra.onMouseLeave?.(e);
                },
                onTouchEnd: (e: React.TouchEvent<Element>) => {
                    clear();
                    e.preventDefault();
                    extra.onTouchEnd?.(e);
                },
                onMouseMove: (e: React.MouseEvent<Element>) => {
                    move(e.pageX, e.pageY)
                    extra.onMouseMove?.(e);
                },
                onTouchMove: (e: React.TouchEvent<Element>) => {
                    if (e.touches.length < 2) {
                        move(e.touches[0].pageX, e.touches[0].pageY);
                    }
                    extra.onTouchMove?.(e);
                },
                onContextMenu: (e: React.MouseEvent<Element>) => {
                    e.preventDefault();
                }
            };
        },
        [onLongPress, onClick, extraHandlers, startPos, latestPos]
    );

    return results;
}
