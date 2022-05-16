import React, { useState, useEffect } from 'react'
import {
    Typography,
    CardContent,
    Card,
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
import * as yup from 'yup'
import { useAPI } from '../../contexts/apiContext'
import { useSnackbar } from 'notistack';

const validationSchema = yup.object({
    nome: yup
        .string('Informe seu nome')
        .required('Campo obrigatório'),
    nomeGuerra: yup
        .string('Informe seu nome de guerra')
        .required('Campo obrigatório'),
    tipoPostoGradId: yup
        .number('Selecione o posto/graduação')
        .required('Campo obrigatório'),
    tipoTurnoId: yup
        .number('Selecione o turno')
        .required('Campo obrigatório'),
});

export default function UserInfoCard() {

    const {
        getUsuarioInfo,
        getTurnos,
        getPostos,
        getUUID,
        atualizaUsuarioInfo
    } = useAPI()

    const [userInfo, setUserInfo] = useState(null)
    const [listaPostoGrad, setListaPostoGrad] = useState([])
    const [listaTurno, setListaTurno] = useState([])

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const [usuario, listaPostoGrad, listaTurno] = await Promise.all([
            getUsuarioInfo(),
            getPostos(),
            getTurnos()
        ])
        setUserInfo(usuario)
        setListaPostoGrad(listaPostoGrad)
        setListaTurno(listaTurno)
    }

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };


    useEffect(() => {
        if (!userInfo) return
        formik.setValues(userInfo)
    }, [userInfo]);

    const onSubmit = async (values) => {
        try {
            const response = await atualizaUsuarioInfo(
                getUUID(),
                values.nome,
                values.nomeGuerra,
                values.tipoPostoGradId,
                values.tipoTurnoId,
            )
            fetchData()
            showSnackbar(response.data.message, 'success')
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const formik = useFormik({
        initialValues: {
            nome: '',
            nomeGuerra: '',
            tipoPostoGradId: '',
            tipoTurnoId: '',
        },
        validationSchema: validationSchema,
        onSubmit: onSubmit,
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
                    Atualizar dados do usuário
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
                </form>
            </CardContent>
        </Card>
    );
}