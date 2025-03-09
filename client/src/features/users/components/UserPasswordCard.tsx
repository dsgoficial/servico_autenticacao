// Path: features\users\components\UserPasswordCard.tsx
import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserPassword } from '@/hooks/useUsers';
import { UserPasswordChange } from '@/types/user';

// Form validation schema using zod
const passwordSchema = z
  .object({
    senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
    novaSenha: z
      .string()
      .min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    confirmarNovaSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine(data => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarNovaSenha'],
  });

const UserPasswordCard = () => {
  const { updatePassword, isUpdating } = useUserPassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserPasswordChange>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      senhaAtual: '',
      novaSenha: '',
      confirmarNovaSenha: '',
    },
  });

  const onSubmit: SubmitHandler<UserPasswordChange> = data => {
    updatePassword(data);
    reset();
  };

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 3 }}
        >
          Alterar Senha
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <Controller
              name="senhaAtual"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Senha Atual"
                  type={showCurrentPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.senhaAtual}
                  helperText={errors.senhaAtual?.message}
                  disabled={isUpdating}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="novaSenha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nova Senha"
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.novaSenha}
                  helperText={errors.novaSenha?.message}
                  disabled={isUpdating}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmarNovaSenha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirmar Nova Senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.confirmarNovaSenha}
                  helperText={errors.confirmarNovaSenha?.message}
                  disabled={isUpdating}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isUpdating}
              sx={{ mt: 3 }}
            >
              {isUpdating ? 'Atualizando...' : 'Alterar Senha'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserPasswordCard;
