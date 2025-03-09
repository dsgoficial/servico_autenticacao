// Path: features\users\routes\UserPassword.tsx
import { Container, Typography, Box } from '@mui/material';
import Page from '@/components/Page/Page';
import UserPasswordCard from '@/features/users/components/UserPasswordCard';

const UserPassword = () => {
  return (
    <Page title="Alterar Senha | Serviço de Autenticação">
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Alterar Senha
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Atualize sua senha de acesso
          </Typography>
        </Box>

        <UserPasswordCard />
      </Container>
    </Page>
  );
};

export default UserPassword;
