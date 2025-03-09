// Path: features\dashboard\components\Card.tsx
import { Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CardProps {
  label: string;
  currentValue: number;
}

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
  alignItems: 'center',
  position: 'relative',
  height: '140px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

export const DashboardCard = ({ label, currentValue }: CardProps) => {
  return (
    <Card elevation={3}>
      <CardContentStyle>
        <Typography variant="h3" color="primary">
          {currentValue.toLocaleString()}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {label}
        </Typography>
      </CardContentStyle>
    </Card>
  );
};
