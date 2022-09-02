import React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Container, Avatar, Paper, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { Navigate, Link as RouterLink } from 'react-router-dom'
import Page from '../components/Page';
import SubmitButton from '../components/SubmitButton'
import { useSnackbar } from 'notistack';
import BackgroundImages from '../components/BackgroundImages'
import { useAPI } from '../contexts/apiContext'
import { styled } from '@mui/system';

const validationSchema = Yup.object().shape({
    usuario: Yup.string()
        .required('Preencha seu usuário'),
    senha: Yup.string()
        .required('Preencha sua senha')
})

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

const FormStyled = styled(Form)(({ theme }) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
}));

const SubmitButtonStyled = styled(SubmitButton)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2)
}));

export default function LoginPage() {
    const {
        handleLogin,
        handleApiError,
        history,
        isAuthenticated
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    const values = { usuario: '', senha: '' }

    const onSubmit = async (values) => {
        try {
            const success = await handleLogin(values.usuario, values.senha)
            if (success) history.go('/')
        } catch (err) {
            const error = handleApiError(err)
            console.log(error)
            showSnackbar(error.msg, error.status)
        }
    }

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
                            <Avatar sx={{
                                bgcolor: '#F50057'
                            }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component='h1' variant='h5'>
                                Serviço de Autenticação
                            </Typography>
                            <Formik
                                initialValues={values}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ isValid, isSubmitting, isValidating }) => (
                                    <FormStyled>
                                        <Field
                                            name='usuario'
                                            component={TextField}
                                            variant='outlined'
                                            margin='normal'
                                            fullWidth
                                            label='Usuário'
                                        />
                                        <Field
                                            type='password' name='senha'
                                            component={TextField}
                                            variant='outlined'
                                            margin='normal'
                                            fullWidth
                                            label='Senha'
                                        />
                                        <SubmitButtonStyled
                                            type='submit' disabled={isValidating || !isValid} submitting={isSubmitting}
                                            fullWidth
                                            variant='contained'
                                            color='primary'
                                        >
                                            Entrar
                                        </SubmitButtonStyled>
                                        <Button
                                            variant="text"
                                            component={RouterLink}
                                            to={'/cadastro'}>
                                            Criar novo usuário
                                        </Button>
                                    </FormStyled>
                                )}
                            </Formik>
                        </PaperStyled>
                    </Container>
                </DivStyled>
            </BackgroundImages>
        </Page>
    );
}