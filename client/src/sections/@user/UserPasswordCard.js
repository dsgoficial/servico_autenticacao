import React from 'react'
import {
    Typography,
    CardContent,
    Card,
    Stack,
    TextField,
    Button
} from '@mui/material';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useSnackbar } from 'notistack';
import { useAPI } from '../../contexts/apiContext'

const validationSchema = yup.object({
    senhaAtual: yup
        .string('Preencha sua senha atual')
        .required('Campo obrigatório'),
    novaSenha: yup
        .string('Preencha sua nova senha')
        .required('Campo obrigatório'),
    confirmarNovaSenha: yup
        .string('Confirme sua nova senha')
        .required('Campo obrigatório')
        .oneOf([yup.ref('novaSenha')], 'As senhas devem ser iguais')
});

export default function UserPasswordCard() {

    const {
        atualizarSenhas,
        getUUID
    } = useAPI()

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            senhaAtual: '',
            novaSenha: '',
            confirmarNovaSenha: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const uuid = getUUID()
                const response = await atualizarSenhas(uuid, values.senhaAtual, values.novaSenha)
                showSnackbar(response.data.message, 'success')
                resetForm()
            } catch (error) {
                showSnackbar(error.message, 'error')
            }
        },
    });

    return (
        <Card>
            <CardContent>
                <Typography
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                    gutterBottom
                    variant="h4"
                    component="div"
                >
                    Atualizar Senha
                </Typography>
                <form
                    onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flexDirection: 'column',
                            minHeight: '400px'
                        }}
                    >
                        <TextField
                            fullWidth
                            type='password'
                            id="senhaAtual"
                            name="senhaAtual"
                            label="Senha atual"
                            value={formik.values.senhaAtual}
                            onChange={formik.handleChange}
                            error={formik.touched.senhaAtual && Boolean(formik.errors.senhaAtual)}
                            helperText={formik.touched.senhaAtual && formik.errors.senhaAtual}
                        />
                        <TextField
                            fullWidth
                            type='password'
                            id="novaSenha"
                            name="novaSenha"
                            label="Nova senha"
                            value={formik.values.novaSenha}
                            onChange={formik.handleChange}
                            error={formik.touched.novaSenha && Boolean(formik.errors.novaSenha)}
                            helperText={formik.touched.novaSenha && formik.errors.novaSenha}
                        />
                        <TextField
                            fullWidth
                            type='password'
                            id="confirmarNovaSenha"
                            name="confirmarNovaSenha"
                            label="Confirmar nova senha"
                            value={formik.values.confirmarNovaSenha}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmarNovaSenha && Boolean(formik.errors.confirmarNovaSenha)}
                            helperText={formik.touched.confirmarNovaSenha && formik.errors.confirmarNovaSenha}
                        />
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Atualizar Senha
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
}