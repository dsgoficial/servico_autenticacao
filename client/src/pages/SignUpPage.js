import React, { useState, useEffect } from 'react'
import {
    Typography,
    Container,
    Paper,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    Stack,
    TextField,
    Button
} from '@mui/material';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Navigate, Link as RouterLink } from 'react-router-dom'
import Page from '../components/Page';
import { useSnackbar } from 'notistack';
import BackgroundImages from '../components/BackgroundImages'
import { useAPI } from '../contexts/apiContext'
import { styled } from '@mui/system';

const validationSchema = Yup.object().shape({
    usuario: Yup.string()
        .required('Preencha seu usuário'),
    senha: Yup.string()
        .required('Preencha sua senha'),
    confirmarSenha: Yup.string()
        .required('Confirme sua senha')
        .oneOf([Yup.ref('senha')], 'As senhas devem ser iguais'),
    nome: Yup.string()
        .required('Preencha seu nome completo'),
    nomeGuerra: Yup.string()
        .required('Preencha seu nome de guerra'),
    tipoPostoGradId: Yup
        .number('Selecione o posto/graduação')
        .required('Campo obrigatório'),
    tipoTurnoId: Yup
        .number('Selecione o turno')
        .required('Campo obrigatório')
})

const Form = styled('form')(({ theme }) => ({
    width: '100%'
}));

const DivStyled = styled('div')(({ theme }) => ({
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3, 2),
    elevation: 3
}));

export default function SignUpPage() {
    const {
        signUp,
        isAuthenticated,
        getPositions,
        getRotation
    } = useAPI()

    const [listaPostoGrad, setListaPostoGrad] = useState([])
    const [listaTurno, setListaTurno] = useState([])

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchData()
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const fetchData = async () => {
        const [listaPostoGrad, listaTurno] = await Promise.all([
            getPositions(),
            getRotation()
        ])
        setListaPostoGrad(listaPostoGrad)
        setListaTurno(listaTurno)
    }

    const formik = useFormik({
        initialValues: {
            usuario: '',
            senha: '',
            confirmarSenha: '',
            nome: '',
            nomeGuerra: '',
            tipoPostoGradId: '',
            tipoTurnoId: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const success = await signUp(
                values.usuario,
                values.senha,
                values.nome,
                values.nomeGuerra,
                values.tipoPostoGradId,
                values.tipoTurnoId
            )
            if (!success) {
                showSnackbar('Falha ao cadastrar usuário!', 'error')
                return
            }
            showSnackbar('Usuário criado com sucesso. Entre em contato com o gerente para autorizar o login.', 'success')
            resetForm()
        },
    });

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    if (isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return (
        <Page title="Serviço de Autenticação">
            <BackgroundImages>
                <DivStyled>
                    <Container component='main' maxWidth='xs'>
                        <PaperStyled>
                            <Typography component='h1' variant='h5'>
                                Cadastro de novo usuário
                            </Typography>
                            <Form
                                onSubmit={formik.handleSubmit}>
                                <Stack
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        minHeight: '600px'
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        id="usuario"
                                        name="usuario"
                                        label="Usuário"
                                        value={formik.values.usuario}
                                        onChange={formik.handleChange}
                                        error={formik.touched.usuario && Boolean(formik.errors.usuario)}
                                        helperText={formik.touched.usuario && formik.errors.usuario}
                                    />
                                    <TextField
                                        fullWidth
                                        type='password'
                                        id="senha"
                                        name="senha"
                                        label="Senha"
                                        value={formik.values.senha}
                                        onChange={formik.handleChange}
                                        error={formik.touched.senha && Boolean(formik.errors.senha)}
                                        helperText={formik.touched.senha && formik.errors.senha}
                                    />
                                    <TextField
                                        fullWidth
                                        type='password'
                                        id="confirmarSenha"
                                        name="confirmarSenha"
                                        label="Confirma Senha"
                                        value={formik.values.confirmarSenha}
                                        onChange={formik.handleChange}
                                        error={formik.touched.confirmarSenha && Boolean(formik.errors.confirmarSenha)}
                                        helperText={formik.touched.confirmarSenha && formik.errors.confirmarSenha}
                                    />
                                    <TextField
                                        fullWidth
                                        id="nome"
                                        name="nome"
                                        label="Nome completo"
                                        value={formik.values.nome}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nome && Boolean(formik.errors.nome)}
                                        helperText={formik.touched.nome && formik.errors.nome}
                                    />
                                    <TextField
                                        fullWidth
                                        id="nomeGuerra"
                                        name="nomeGuerra"
                                        label="Nome de guerra"
                                        value={formik.values.nomeGuerra}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nomeGuerra && Boolean(formik.errors.nomeGuerra)}
                                        helperText={formik.touched.nomeGuerra && formik.errors.nomeGuerra}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel >Posto/Graduação</InputLabel>
                                        <Select
                                            id="tipoPostoGradId"
                                            name="tipoPostoGradId"
                                            label="Posto/Graduação"
                                            value={formik.values.tipoPostoGradId}
                                            onChange={formik.handleChange}
                                            error={formik.touched.tipoPostoGradId && Boolean(formik.errors.tipoPostoGradId)}
                                        >
                                            {
                                                listaPostoGrad.map(item => {
                                                    return <MenuItem
                                                        key={item.nome}
                                                        value={item.code}
                                                    >
                                                        {item.nome}
                                                    </MenuItem>
                                                })
                                            }
                                        </Select>
                                        <FormHelperText
                                            error={formik.touched.tipoPostoGradId && Boolean(formik.errors.tipoPostoGradId)}
                                        >{
                                                formik.touched.tipoPostoGradId &&
                                                formik.errors.tipoPostoGradId
                                            }
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel >Turno</InputLabel>
                                        <Select
                                            id="tipoTurnoId"
                                            label="Turno"
                                            name="tipoTurnoId"
                                            value={formik.values.tipoTurnoId}
                                            onChange={formik.handleChange}
                                            error={formik.touched.tipoTurnoId && Boolean(formik.errors.tipoTurnoId)}
                                        >
                                            {
                                                listaTurno.map(item => {
                                                    return <MenuItem
                                                        key={item.nome}
                                                        value={item.code}
                                                    >
                                                        {item.nome}
                                                    </MenuItem>
                                                })
                                            }
                                        </Select>
                                        <FormHelperText
                                            error={formik.touched.tipoTurnoId && Boolean(formik.errors.tipoTurnoId)}
                                        >{
                                                formik.touched.tipoTurnoId &&
                                                formik.errors.tipoTurnoId
                                            }
                                        </FormHelperText>
                                    </FormControl>
                                    <Button color="primary" variant="contained" fullWidth type="submit">
                                        Atualizar Dados
                                    </Button>
                                </Stack>
                                <Button
                                    variant="text"
                                    component={RouterLink}
                                    to={'/login'}>
                                    Login
                                </Button>
                            </Form>
                        </PaperStyled>
                    </Container>
                </DivStyled>
            </BackgroundImages>
        </Page>
    );
}