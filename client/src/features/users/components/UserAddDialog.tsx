// Path: features\users\components\UserAddDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  DialogContentText,
  SelectChangeEvent,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsers } from '@/hooks/useUsers';
import { UserCreateRequest } from '@/types/user';

interface UserAddDialogProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = z.object({
  usuario: z
    .string()
    .min(1, 'Preencha seu usuário')
    .regex(
      /^[a-z]+$/,
      'O nome do usuário deve ser em minúsculo e não conter espaços ou caracteres especiais',
    ),
  nome: z.string().min(1, 'Preencha seu nome completo'),
  nomeGuerra: z.string().min(1, 'Preencha seu nome de guerra'),
  tipoPostoGradId: z.number({
    required_error: 'Selecione o posto/graduação',
    invalid_type_error: 'Posto/graduação inválido',
  }),
  tipoTurnoId: z.number({
    required_error: 'Selecione o turno',
    invalid_type_error: 'Turno inválido',
  }),
  ativo: z.boolean(),
  administrador: z.boolean(),
  uuid: z.string().optional(),
});

type FormValues = z.infer<typeof validationSchema>;

const UserAddDialog = ({ open, onClose }: UserAddDialogProps) => {
  const { positions, shifts, createUser, isCreating } = useUsers();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      usuario: '',
      nome: '',
      nomeGuerra: '',
      tipoPostoGradId: 0,
      tipoTurnoId: 0,
      ativo: false,
      administrador: false,
      uuid: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormValues) => {
    const userData: UserCreateRequest = {
      ...data,
      tipoPostoGradId: Number(data.tipoPostoGradId),
      tipoTurnoId: Number(data.tipoTurnoId),
    };

    createUser(userData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar usuário</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pb: 2,
            }}
          >
            <Controller
              name="usuario"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Usuário"
                  fullWidth
                  error={!!errors.usuario}
                  helperText={errors.usuario?.message}
                />
              )}
            />

            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome completo"
                  fullWidth
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                />
              )}
            />

            <Controller
              name="nomeGuerra"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome de guerra"
                  fullWidth
                  error={!!errors.nomeGuerra}
                  helperText={errors.nomeGuerra?.message}
                />
              )}
            />

            <Controller
              name="tipoPostoGradId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.tipoPostoGradId}>
                  <InputLabel>Posto/Graduação</InputLabel>
                  <Select
                    {...field}
                    label="Posto/Graduação"
                    onChange={(e: SelectChangeEvent<number>) => {
                      field.onChange(Number(e.target.value));
                    }}
                  >
                    <MenuItem value={0} disabled>
                      Selecione o posto/graduação
                    </MenuItem>
                    {positions.map(item => (
                      <MenuItem key={item.nome} value={item.code}>
                        {item.nome}
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
                <FormControl fullWidth error={!!errors.tipoTurnoId}>
                  <InputLabel>Turno</InputLabel>
                  <Select
                    {...field}
                    label="Turno"
                    onChange={(e: SelectChangeEvent<number>) => {
                      field.onChange(Number(e.target.value));
                    }}
                  >
                    <MenuItem value={0} disabled>
                      Selecione o turno
                    </MenuItem>
                    {shifts.map(item => (
                      <MenuItem key={item.nome} value={item.code}>
                        {item.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.tipoTurnoId?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <FormGroup>
              <Controller
                name="administrador"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Administrador"
                  />
                )}
              />
              <Controller
                name="ativo"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Ativo"
                  />
                )}
              />
            </FormGroup>

            <Controller
              name="uuid"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="UUID (opcional)"
                  fullWidth
                  error={!!errors.uuid}
                  helperText={errors.uuid?.message}
                />
              )}
            />
          </Box>

          <DialogContentText variant="caption">
            UUID pode ser deixado em branco, sendo gerado automaticamente.
          </DialogContentText>
          <DialogContentText variant="caption">
            A senha do usuário criado será igual ao login.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isCreating}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isCreating}
          >
            {isCreating ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserAddDialog;
