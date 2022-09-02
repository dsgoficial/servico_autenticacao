import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { green, red } from '@material-ui/core/colors'
import { styled } from '@mui/material/styles';

const CardContentStyle = styled(CardContent)(({ theme }) => ({
    textAlign: 'center',
    alignItems: 'center',
    position: 'relative',
    height: '140px',
    boxSizing: 'border-box'
}));

const DivStyle = styled('div')(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
}));

const calcVariation = (series, seriesKey) => {
    if (series.length < 2) return 0

    const current = +series[series.length - 1][seriesKey]
    const past = +series[series.length - 2][seriesKey]

    if (!past && !current) return 0

    if (!past) return 100

    if (!current) return -100

    const percent = 100 * (current - past) / past
    return Math.round(percent * 10) / 10
}

const CardGraph = ({ label, series, seriesKey, fill }) => {

    return (
        <Card>
            <CardContentStyle>
                <DivStyle>
                    <ResponsiveContainer>
                        <AreaChart
                            data={series}
                        >
                            <Area type='monotone' dataKey={seriesKey} stroke={fill} fill={fill} strokeOpacity={0.8} fillOpacity={0.20} />
                        </AreaChart>
                    </ResponsiveContainer>
                </DivStyle>
                <Typography variant='h3'>{series[series.length - 1][seriesKey]}</Typography>
                <Typography variant='subtitle1'>{label}</Typography>
                {calcVariation(series, seriesKey) > 0 ? (
                    <Grid container direction='row' justify='center' alignItems='center'>
                        <Grid item>
                            <ArrowDropUpIcon style={{ color: green[500] }} />
                        </Grid>
                        <Grid item>
                            <Typography variant='subtitle2' style={{ color: green[500] }}>
                                {`${calcVariation(series, seriesKey)}%`}
                            </Typography>
                        </Grid>
                    </Grid>
                )
                    : (
                        <Grid container direction='row' justify='center' alignItems='center'>
                            <Grid item>
                                <ArrowDropDownIcon style={{ color: red[500] }} />
                            </Grid>
                            <Grid item>
                                <Typography variant='subtitle2' style={{ color: red[500] }}>
                                    {`${Math.abs(calcVariation(series, seriesKey))}%`}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
            </CardContentStyle>
        </Card>
    )
}

export default CardGraph;