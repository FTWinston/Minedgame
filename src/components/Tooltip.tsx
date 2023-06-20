import React, { useState, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface Props {
    title: string;
}

const Display = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '0.5em',
    borderRadius: '0.125em',
    backgroundColor: '#333',
    color: 'white',
});

export const Tooltip: React.FC<PropsWithChildren<Props>> = props => {
    const child = React.isValidElement(props.children) ? props.children : <span>{props.children}</span>;

    const [showing, setShowing] = useState(false);

    useEffect(() => {
        if (!showing) {
            return;
        }

        
    }, [showing]);

    const show = () => setShowing(true);
    const hide = () => setShowing(true);

    const childProps = {
        ['aria-label']: props.title,
        onMouseOver: show,
        onBlur: hide,
        onMouseDown: show,
        ontouchstart: show,
    };

    return (
        <>
            {React.cloneElement(child, childProps)}
            {showing ? (
                <Display>{props.title}</Display>
            ) : undefined}
        </>
    );
}
