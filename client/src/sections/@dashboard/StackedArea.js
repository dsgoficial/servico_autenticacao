import React from 'react'
import Card from '@mui/material/Card'
import Paper from '@mui/material/Paper'
import CardContent from '@mui/material/CardContent'
import { AreaChart, ResponsiveContainer, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Typography from '@mui/material/Typography'

// http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=12
const colors = ['#8dd3c7', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5']

const CustomTooltip = ({ type, payload, label, active }) => {

    return (
        active ? (
            <Paper
                sx={{
                    padding: (theme) => theme.spacing(2),
                    display: 'flex',
                    overflow: 'auto',
                    flexDirection: 'column'
                }}
            >
                <Typography variant='subtitle1' component='p' gutterBottom>{label}</Typography>
                {payload.map((p, i) => (
                    <Typography key={i} variant='body2' component='p' color='textSecondary'>{`${payload[i].name} : ${+payload[i].value}`}</Typography>
                ))}
                <Typography variant='subtitle2' component='p' sx={{ marginTop: 5 }}>{`Total: ${payload.reduce((a, b) => +a + +b.value, 0)}`}</Typography>
            </Paper>
        ) : null
    )
}

const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props

    return (
        <g transform={`translate(${x},${y})`}>
            <text dy={16} textAnchor='middle' fill='#666'>{payload.value}</text>
        </g>
    )
}

const prepareData = (series, dataKey) => {
    return Object.keys(series[0]).filter(v => v !== dataKey)
}

const StackedArea = ({ title, series, dataKey }) => {
    
    return (
        <Card
            sx={{
                padding: (theme) => theme.spacing(2),
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
                height: 500
            }}
        >
            <Typography variant='h6' gutterBottom>{title}</Typography>
            <CardContent sx={{
                flex: '1 0 auto',
                textAlign: 'center',
                alignItems: 'center',
                position: 'relative'
            }}>
                {series.length > 0 ? (
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart
                            margin={{ top: 20, right: 0, left: 0, bottom: 10 }}
                            data={series}
                        >
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={dataKey} height={60} tick={<CustomizedAxisTick />} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType='square' />
                            {prepareData(series, dataKey).map((s, i) => (
                                <Area key={i} type='monotone' dataKey={s} stackId='1' stroke={colors[i]} fill={colors[i]} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                )
                    : (
                        <Typography variant='h5' gutterBottom>Sem dados para exibir</Typography>
                    )}
            </CardContent>
        </Card>
    )
}

export default StackedArea;
