// Path: features\users\routes\UsersManage.tsx
import { Box, Container, Typography } from '@mui/material';
import Page from '@/components/Page/Page';
import UsersManageTable from '../components/UsersManageTable';

const UsersManage = () => {
  return (
    <Page title="Gerenciar Usuários - Serviço de Autenticação">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Gerenciar Usuários
        </Typography>
        <Box>
          <UsersManageTable />
        </Box>
      </Container>
    </Page>
  );
};

export default UsersManage;
