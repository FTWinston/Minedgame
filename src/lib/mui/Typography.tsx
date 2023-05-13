import { styled } from '@mui/material/styles';
import MuiTypography from '@mui/material/Typography';
import { ComponentProps } from 'react';

interface Overridable {
    component?: React.ElementType;
}

export const Typography = styled(MuiTypography)<ComponentProps<typeof MuiTypography> & Overridable>({
    fontSize: '1em',
});
