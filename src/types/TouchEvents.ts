export interface TouchEvents<TElement extends Element = Element> {
    onClick?: (e: React.MouseEvent<TElement>) => void;
    onMouseDown?: (e: React.MouseEvent<TElement, MouseEvent>) => void;
    onMouseUp?: (e: React.MouseEvent<TElement, MouseEvent>) => void;
    onMouseMove?: (e: React.MouseEvent<TElement, MouseEvent>) => void;
    onMouseEnter?: (e: React.MouseEvent<TElement, MouseEvent>) => void;
    onMouseLeave?: (e: React.MouseEvent<TElement, MouseEvent>) => void;
    onTouchStart?: (e: React.TouchEvent<TElement>) => void;
    onTouchEnd?: (e: React.TouchEvent<TElement>) => void;
    onTouchMove?: (e: React.TouchEvent<TElement>) => void;
}