// Path: features\users\routes\UserInfo.tsx
import { Container, Typography, Box } from '@mui/material';
import Page from '@/components/Page/Page';
import UserInfoCard from '@/features/users/components/UserInfoCard';

const UserInfo = () => {
  return (
    <Page title="Informações do Usuário | Serviço de Autenticação">
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Perfil do Usuário
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Atualize seus dados pessoais
          </Typography>
        </Box>

        <UserInfoCard />
      </Container>
    </Page>
  );
};

export default UserInfo;
