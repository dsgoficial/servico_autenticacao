// Path: features\dashboard\components\StackedArea.tsx
import { useMemo } from 'react';
import { Card, Paper, CardContent, Typography, useTheme } from '@mui/material';
import {
  AreaChart,
  ResponsiveContainer,
  Legend,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { alpha } from '@mui/material/styles';

interface StackedAreaProps {
  title: string;
  series: Array<Record<string, any>>;
  dataKey: string;
}

// Color palette for chart series
// http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=12
const DEFAULT_COLORS = [
  '#8dd3c7',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();

  if (!active || !payload || payload.length === 0) return null;

  const total = payload.reduce(
    (sum: number, entry: any) => sum + (+entry.value || 0),
    0,
  );

  return (
    <Paper
      elevation={3}
      sx={{
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: 300,
      }}
    >
      <Typography variant="subtitle1" component="p" gutterBottom>
        {label}
      </Typography>
      {payload.map((entry: any, i: number) => (
        <Typography key={i} variant="body2" component="p" color="textSecondary">
          {`${entry.name}: ${+entry.value}`}
        </Typography>
      ))}
      <Typography
        variant="subtitle2"
        component="p"
        sx={{
          marginTop: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          paddingTop: 1,
        }}
      >
        {`Total: ${total}`}
      </Typography>
    </Paper>
  );
};

// Custom axis tick
const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const theme = useTheme();

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dy={16}
        textAnchor="middle"
        fill={theme.palette.text.secondary}
        fontSize={12}
      >
        {payload.value}
      </text>
    </g>
  );
};

export const StackedArea = ({ title, series, dataKey }: StackedAreaProps) => {
  const theme = useTheme();

  // Extract all series keys except the dataKey
  const seriesKeys = useMemo(() => {
    if (!series || series.length === 0) return [];
    return Object.keys(series[0]).filter(key => key !== dataKey);
  }, [series, dataKey]);

  // If no data, show an empty state
  if (!series || series.length === 0) {
    return (
      <Card
        elevation={3}
        sx={{
          padding: theme.spacing(2),
          height: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" color="textSecondary">
          Sem dados para exibir
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      elevation={3}
      sx={{
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 500,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <CardContent
        sx={{
          flex: '1 0 auto',
          textAlign: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: 0,
          '&:last-child': { paddingBottom: 0 },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={alpha(theme.palette.text.secondary, 0.2)}
            />
            <XAxis
              dataKey={dataKey}
              height={60}
              tick={<CustomizedAxisTick />}
              stroke={alpha(theme.palette.text.secondary, 0.7)}
            />
            <YAxis stroke={alpha(theme.palette.text.secondary, 0.7)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="square" wrapperStyle={{ paddingTop: 10 }} />
            {seriesKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
