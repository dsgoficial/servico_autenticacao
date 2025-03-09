// Path: features\users\components\UserInfoCard.tsx
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserProfile } from '@/hooks/useUsers';
import { UserInfoUpdateRequest } from '@/types/user';

// Form validation schema using zod
const userInfoSchema = z.object({
  nome: z.string().min(1, 'Nome completo é obrigatório'),
  nome_guerra: z.string().min(1, 'Nome de guerra é obrigatório'),
  tipo_posto_grad_id: z.number({
    required_error: 'Selecione seu posto/graduação',
    invalid_type_error: 'Selecione seu posto/graduação',
  }),
  tipo_turno_id: z.number({
    required_error: 'Selecione seu turno',
    invalid_type_error: 'Selecione seu turno',
  }),
});

// Type for the form based on the schema
type UserInfoFormValues = z.infer<typeof userInfoSchema>;

const UserInfoCard = () => {
  const { userInfo, positions, shifts, isLoading, updateProfile, isUpdating } =
    useUserProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      nome: '',
      nome_guerra: '',
      tipo_posto_grad_id: 0,
      tipo_turno_id: 0,
    },
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (userInfo) {
      reset({
        nome: userInfo.nome,
        nome_guerra: userInfo.nome_guerra,
        tipo_posto_grad_id: userInfo.tipo_posto_grad_id,
        tipo_turno_id: userInfo.tipo_turno_id,
      });
    }
  }, [userInfo, reset]);

  const onSubmit: SubmitHandler<UserInfoFormValues> = data => {
    // Convert to UserInfoUpdateRequest format
    const updateData: UserInfoUpdateRequest = {
      nome: data.nome,
      nomeGuerra: data.nome_guerra,
      tipoPostoGradId: data.tipo_posto_grad_id,
      tipoTurnoId: data.tipo_turno_id,
    };
    updateProfile(updateData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

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
          Informações do Usuário
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome Completo"
                  fullWidth
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  disabled={isUpdating}
                />
              )}
            />

            <Controller
              name="nome_guerra"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome de Guerra"
                  fullWidth
                  error={!!errors.nome_guerra}
                  helperText={errors.nome_guerra?.message}
                  disabled={isUpdating}
                />
              )}
            />

            <Controller
              name="tipo_posto_grad_id"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.tipo_posto_grad_id}>
                  <InputLabel id="posto-grad-label">Posto/Graduação</InputLabel>
                  <Select
                    {...field}
                    labelId="posto-grad-label"
                    label="Posto/Graduação"
                    value={field.value ? field.value.toString() : ''}
                    onChange={(e: SelectChangeEvent) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : '',
                      )
                    }
                    disabled={isUpdating}
                  >
                    {positions.map(position => (
                      <MenuItem key={position.code} value={position.code}>
                        {position.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipo_posto_grad_id && (
                    <FormHelperText>
                      {errors.tipo_posto_grad_id.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="tipo_turno_id"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.tipo_turno_id}>
                  <InputLabel id="turno-label">Turno</InputLabel>
                  <Select
                    {...field}
                    labelId="turno-label"
                    label="Turno"
                    value={field.value ? field.value.toString() : ''}
                    onChange={(e: SelectChangeEvent) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : '',
                      )
                    }
                    disabled={isUpdating}
                  >
                    {shifts.map(shift => (
                      <MenuItem key={shift.code} value={shift.code}>
                        {shift.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipo_turno_id && (
                    <FormHelperText>
                      {errors.tipo_turno_id.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isUpdating}
              sx={{ mt: 3 }}
            >
              {isUpdating ? 'Atualizando...' : 'Atualizar Dados'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
