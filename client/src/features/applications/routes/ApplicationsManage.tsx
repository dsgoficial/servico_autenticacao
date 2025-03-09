// Path: features\applications\routes\ApplicationsManage.tsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Page from '@/components/Page/Page';
import { ApplicationsManageTable } from '../components/ApplicationsManageTable';

const ApplicationsManage: React.FC = () => {
  return (
    <Page title="Gerenciar Aplicações | Serviço de Autenticação">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Gerenciar Aplicações
        </Typography>

        <Box sx={{ mt: 3 }}>
          <ApplicationsManageTable />
        </Box>
      </Container>
    </Page>
  );
};

export default ApplicationsManage;
