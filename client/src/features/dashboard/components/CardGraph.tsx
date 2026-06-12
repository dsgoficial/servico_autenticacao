// Path: features\dashboard\components\CardGraph.tsx
import { useMemo } from 'react';
import { Typography, Card, Grid, CardContent } from '@mui/material';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RemoveIcon from '@mui/icons-material/Remove';
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

  // Tendência: alta (verde), queda (vermelho) ou estável (neutro).
  // Sem este terceiro caso, variação 0 caía no ramo de queda.
  const trend =
    variation > 0
      ? {
          icon: <ArrowDropUpIcon sx={{ color: 'success.main' }} />,
          color: 'success.main',
        }
      : variation < 0
        ? {
            icon: <ArrowDropDownIcon sx={{ color: 'error.main' }} />,
            color: 'error.main',
          }
        : {
            icon: (
              <RemoveIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
            ),
            color: 'text.secondary',
          };

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
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>{trend.icon}</Grid>
          <Grid item>
            <Typography variant="subtitle2" sx={{ color: trend.color }}>
              {`${Math.abs(variation)}%`}
            </Typography>
          </Grid>
        </Grid>
      </CardContentStyle>
    </Card>
  );
};
