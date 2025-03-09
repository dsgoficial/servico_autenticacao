// Path: features\users\routes\UsersAuth.tsx
import { Box, Container, Typography } from '@mui/material';
import Page from '@/components/Page/Page';
import UsersAuthTable from '../components/UsersAuthTable';

const UsersAuth = () => {
  return (
    <Page title="Autorizar Usuários - Serviço de Autenticação">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Autorizar Usuários
        </Typography>
        <Box>
          <UsersAuthTable />
        </Box>
      </Container>
    </Page>
  );
};

export default UsersAuth;
