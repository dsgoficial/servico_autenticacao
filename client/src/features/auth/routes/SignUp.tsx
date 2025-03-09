// Path: features\auth\routes\SignUp.tsx
import { useState } from 'react'; // Removed useEffect
import { Link as RouterLink, Navigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  Alert,
  Container,
  Paper,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../../components/layouts/AuthLayout';
import Page from '../../../components/Page/Page';
import { useAuth } from '../../../hooks/useAuth';
import { useThemeMode } from '../../../contexts/ThemeContext';
import { useUserData } from '../../../hooks/useUserData';
import { PositionType, RotationType } from '@/types/auth';

// Form validation schema
const signUpSchema = z
  .object({
    usuario: z
      .string()
      .min(1, 'Preencha seu usuário')
      .regex(/^[a-z]+$/, 'O usuário deve ser em minúsculo e sem espaços'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha'),
    nome: z.string().min(3, 'Digite seu nome completo'),
    nomeGuerra: z.string().min(2, 'Digite seu nome de guerra'),
    tipoPostoGradId: z.number({
      required_error: 'Selecione seu posto/graduação',
      invalid_type_error: 'Posto/graduação inválido',
    }),
    tipoTurnoId: z.number({
      required_error: 'Selecione seu turno',
      invalid_type_error: 'Turno inválido',
    }),
  })
  .refine(data => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { isAuthenticated, signUp } = useAuth();
  const { positions, rotations, isLoading } = useUserData();
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get the random image number (1-5) for consistent layout with the original
  const [randomImageNumber] = useState(() => Math.floor(Math.random() * 5) + 1);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      usuario: '',
      senha: '',
      confirmarSenha: '',
      nome: '',
      nomeGuerra: '',
      tipoPostoGradId: 0,
      tipoTurnoId: 0,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const result = await signUp({
        usuario: data.usuario,
        senha: data.senha,
        nome: data.nome,
        nomeGuerra: data.nomeGuerra,
        tipoPostoGradId: data.tipoPostoGradId,
        tipoTurnoId: data.tipoTurnoId,
      });

      if (result) {
        setSuccess(true);
        setErrorMessage(null);
        reset();
      } else {
        setErrorMessage(
          'Falha ao criar usuário. Tente novamente ou contate o administrador.',
        );
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao criar usuário');
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Page title="Cadastro | Serviço de Autenticação">
      <AuthLayout backgroundImageNumber={randomImageNumber}>
        <Container maxWidth="sm" sx={{ py: isMobile ? 2 : 4 }}>
          <Paper
            elevation={isDarkMode ? 24 : 3}
            sx={{
              p: isMobile ? 2 : 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: isDarkMode
                ? alpha(theme.palette.background.paper, 0.8)
                : 'rgba(255, 255, 255, 0.9)',
              boxShadow: isDarkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                : theme.shadows[3],
              border: `1px solid ${
                isDarkMode
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.05)
              }`,
            }}
          >
            <Typography
              component="h1"
              variant={isMobile ? 'h5' : 'h4'}
              align="center"
              sx={{
                mb: 3,
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              Cadastro de Novo Usuário
            </Typography>

            {success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                Usuário criado com sucesso! Entre em contato com o administrador
                para autorizar seu acesso.
              </Alert>
            )}

            {errorMessage && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mb: 2,
                  backgroundColor: isDarkMode
                    ? alpha(theme.palette.error.dark, 0.2)
                    : undefined,
                  color: isDarkMode ? theme.palette.error.light : undefined,
                }}
              >
                {errorMessage}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: '100%' }}
              noValidate
            >
              <TextField
                margin="normal"
                fullWidth
                id="usuario"
                label="Usuário"
                {...register('usuario')}
                error={!!errors.usuario}
                helperText={errors.usuario?.message}
                disabled={isSubmitting}
              />

              <TextField
                margin="normal"
                fullWidth
                id="senha"
                label="Senha"
                type="password"
                {...register('senha')}
                error={!!errors.senha}
                helperText={errors.senha?.message}
                disabled={isSubmitting}
              />

              <TextField
                margin="normal"
                fullWidth
                id="confirmarSenha"
                label="Confirmar Senha"
                type="password"
                {...register('confirmarSenha')}
                error={!!errors.confirmarSenha}
                helperText={errors.confirmarSenha?.message}
                disabled={isSubmitting}
              />

              <TextField
                margin="normal"
                fullWidth
                id="nome"
                label="Nome Completo"
                {...register('nome')}
                error={!!errors.nome}
                helperText={errors.nome?.message}
                disabled={isSubmitting}
              />

              <TextField
                margin="normal"
                fullWidth
                id="nomeGuerra"
                label="Nome de Guerra"
                {...register('nomeGuerra')}
                error={!!errors.nomeGuerra}
                helperText={errors.nomeGuerra?.message}
                disabled={isSubmitting}
              />

              <Controller
                name="tipoPostoGradId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.tipoPostoGradId}
                    disabled={isSubmitting || isLoading}
                  >
                    <InputLabel id="posto-grad-label">
                      Posto/Graduação
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="posto-grad-label"
                      label="Posto/Graduação"
                      value={field.value || ''}
                    >
                      <MenuItem value={0} disabled>
                        Selecione o posto/graduação
                      </MenuItem>
                      {positions.map((pos: PositionType) => (
                        <MenuItem key={pos.code} value={pos.code}>
                          {pos.nome}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.tipoPostoGradId?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="tipoTurnoId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.tipoTurnoId}
                    disabled={isSubmitting || isLoading}
                  >
                    <InputLabel id="turno-label">Turno</InputLabel>
                    <Select
                      {...field}
                      labelId="turno-label"
                      label="Turno"
                      value={field.value || ''}
                    >
                      <MenuItem value={0} disabled>
                        Selecione o turno
                      </MenuItem>
                      {rotations.map((rot: RotationType) => (
                        <MenuItem key={rot.code} value={rot.code}>
                          {rot.nome}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.tipoTurnoId?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting || isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                }}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </Button>

              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                variant="text"
                sx={{ mt: 1 }}
              >
                Já possui conta? Faça login
              </Button>
            </Box>
          </Paper>
        </Container>
      </AuthLayout>
    </Page>
  );
}
