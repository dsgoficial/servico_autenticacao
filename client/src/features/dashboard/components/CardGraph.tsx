// Path: features\dashboard\components\CardGraph.tsx
import { useMemo } from 'react';
import { Typography, Card, Grid, CardContent } from '@mui/material';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { styled } from '@mui/material/styles';

interface CardGraphProps {
  label: string;
  series: Array<Record<string, any>>;
  seriesKey: string;
  fill?: string;
}

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
  alignItems: 'center',
  position: 'relative',
  height: '140px',
  boxSizing: 'border-box',
  padding: theme.spacing(2),
}));

// Fixed: removed unused theme parameter
const ChartContainer = styled('div')(() => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
}));

export const CardGraph = ({
  label,
  series,
  seriesKey,
  fill = '#8dd3c7',
}: CardGraphProps) => {
  // Calculate variation percentage
  const variation = useMemo(() => {
    if (series.length < 2) return 0;

    const current = +series[series.length - 1][seriesKey];
    const past = +series[series.length - 2][seriesKey];

    if (!past && !current) return 0;
    if (!past) return 100;
    if (!current) return -100;

    const percent = (100 * (current - past)) / past;
    return Math.round(percent * 10) / 10;
  }, [series, seriesKey]);

  // Get current value
  const currentValue = useMemo(() => {
    if (series.length === 0) return 0;
    return series[series.length - 1][seriesKey] || 0;
  }, [series, seriesKey]);

  return (
    <Card elevation={3}>
      <CardContentStyle>
        <ChartContainer>
          <ResponsiveContainer>
            <AreaChart data={series}>
              <Area
                type="monotone"
                dataKey={seriesKey}
                stroke={fill}
                fill={fill}
                strokeOpacity={0.8}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Typography variant="h3" color="primary">
          {currentValue}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {label}
        </Typography>
        {variation > 0 ? (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <ArrowDropUpIcon sx={{ color: 'success.main' }} />
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                {`${variation}%`}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <ArrowDropDownIcon sx={{ color: 'error.main' }} />
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                {`${Math.abs(variation)}%`}
              </Typography>
            </Grid>
          </Grid>
        )}
      </CardContentStyle>
    </Card>
  );
};
