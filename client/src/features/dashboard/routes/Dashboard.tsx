// Path: features\dashboard\routes\Dashboard.tsx
import { useMemo } from 'react';
import { Grid, Container, Typography, Box, Alert } from '@mui/material';
import Page from '@/components/Page/Page';
import Loading from '@/components/ui/Loading';
import { DashboardCard } from '../components/Card';
import { CardGraph } from '../components/CardGraph';
import { StackedArea } from '../components/StackedArea';
import { LoginsDataTable } from '../components/LoginsDataTable';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const { dashboardData, summary, isLoading, isError, error } = useDashboard();

  // Memoized data
  const loginsPorDia = useMemo(
    () => dashboardData?.loginsPorDia || [],
    [dashboardData],
  );
  const loginsPorMes = useMemo(
    () => dashboardData?.loginsPorMes || [],
    [dashboardData],
  );

  // Show loading state
  if (isLoading) {
    return (
      <Page title="Dashboard">
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Box display="flex" justifyContent="center" my={4}>
            <Loading />
          </Box>
        </Container>
      </Page>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Page title="Dashboard">
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            Erro ao carregar dados do dashboard:{' '}
            {error?.message || 'Tente novamente.'}
          </Alert>
        </Container>
      </Page>
    );
  }

  // If no data but no error either
  if (!dashboardData || !summary) {
    return (
      <Page title="Dashboard">
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Nenhum dado disponível para exibição.
          </Alert>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={6} lg={3}>
            <CardGraph
              label="Logins hoje"
              series={loginsPorDia}
              seriesKey="logins"
              fill="#8dd3c7"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CardGraph
              label="Logins este mês"
              series={loginsPorMes}
              seriesKey="logins"
              fill="#bebada"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              label="Usuários ativos"
              currentValue={summary.usuariosAtivos}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              label="Aplicações ativas"
              currentValue={summary.aplicacoesAtivas}
            />
          </Grid>

          {/* Stacked Area Charts */}
          <Grid item xs={12} md={12} lg={12}>
            <StackedArea
              title="Logins por dia por aplicação"
              series={dashboardData.loginsPorAplicacao}
              dataKey="data"
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <StackedArea
              title="Logins por dia por usuário"
              series={dashboardData.loginsPorUsuario}
              dataKey="data"
            />
          </Grid>

          {/* Users Table */}
          <Grid item xs={12}>
            <LoginsDataTable usuarios={dashboardData.usuariosLogados} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
