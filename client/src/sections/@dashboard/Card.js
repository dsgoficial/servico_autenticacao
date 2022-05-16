import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles';

const CardContentStyle = styled(CardContent)(({ theme }) => ({
    textAlign: 'center',
    alignItems: 'center',
    position: 'relative',
    height: '140px',
    boxSizing: 'border-box'
}));

const CustomCard = ({ label, currentValue }) => {

    return (
        <Card>
            <CardContentStyle>
                <Typography variant='h3'>{currentValue}</Typography>
                <Typography variant='subtitle1'>{label}</Typography>
            </CardContentStyle>
        </Card>
    )
}


export default CustomCard;
