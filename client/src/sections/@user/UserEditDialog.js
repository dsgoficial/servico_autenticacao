
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    LinearProgress,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAPI } from '../../contexts/apiContext'
import { useSnackbar } from 'notistack';

const validationSchema = yup.object({
    uuid: yup.string(),
    usuario: yup.string()
        .required('Preencha seu usuário')
        .matches(/^[a-z]+$/, 'O nome do usuário deve ser em minúsculo e não conter espaços ou caracteres especiais'),
    nome: yup.string()
        .required('Preencha seu nome completo'),
    nomeGuerra: yup.string()
        .required('Preencha seu nome de guerra'),
    tipoPostoGradId: yup.number()
        .required('Preencha seu posto/graduação'),
    tipoTurnoId: yup.number()
        .required('Preencha seu turno de trabalho'),
    ativo: yup.boolean(),
    administrador: yup.boolean()
});

export default function UserEditDialog({
    open,
    onClose,
    callback,
    usuario
}) {

    const {
        getRotation,
        getPositions,
        updateUser
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    const [submitting, setSubmitting] = useState(false);
    const [listaPostoGrad, setListaPostoGrad] = useState([])
    const [listaTurno, setListaTurno] = useState([])

    useEffect(() => {
        if (!usuario) return
        formik.setValues({
            uuid: usuario.uuid,
            usuario: usuario.login,
            nome: usuario.nome,
            nomeGuerra: usuario.nome_guerra,
            tipoPostoGradId: usuario.tipo_posto_grad_id,
            tipoTurnoId: usuario.tipo_turno_id,
            administrador: usuario.administrador,
            ativo: usuario.ativo,
        })
    }, [usuario]);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const [listaPostoGrad, listaTurno] = await Promise.all([
                getPositions(),
                getRotation()
            ])
            setListaPostoGrad(listaPostoGrad)
            setListaTurno(listaTurno)
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        onClose();
    };

    const handleUpdateUser = async (values, { resetForm }) => {
        try {
            setSubmitting(true);
            const data = await updateUser(
                usuario.uuid,
                values.usuario,
                values.nome,
                values.nomeGuerra,
                values.tipoPostoGradId,
                values.tipoTurnoId,
                values.administrador,
                values.ativo,
                values.uuid
            );
            if(!data){
                showSnackbar("Falha ao atualizar usuário!", "error");
                return
            }
            showSnackbar("Usuário atualizado com sucesso!", "success");
            handleClose()
            resetForm(formik.initialValues);
        } catch (error) {
            showSnackbar(error.message, 'error')
            resetForm(formik.initialValues);
        } finally {
            setSubmitting(false);
            callback()
        }
    }

    const formik = useFormik({
        initialValues: {
            uuid: "",
            usuario: "",
            nome: "",
            nomeGuerra: "",
            tipoPostoGradId: "",
            tipoTurnoId: "",
            ativo: false,
            administrador: false,
        },
        validationSchema: validationSchema,
        onSubmit: handleUpdateUser
    });

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Adicionar usuário</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        sx={{
                            display: 'flex',
                            width: '500px',
                            flexDirection: 'column',
                            paddingRight: 1.7,
                            '& > :not(style)': {
                                m: 1
                            },
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
                            <InputLabel >Selecione seu Posto/Graduação</InputLabel>
                            <Select
                                id="tipoPostoGradId"
                                value={formik.values.tipoPostoGradId}
                                name="tipoPostoGradId"
                                label="Selecione seu Posto/Graduação"
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
                                    formik.errors.tipoPostoGradId}
                            </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel >Selecione seu turno de trabalho</InputLabel>
                            <Select
                                id="tipoTurnoId"
                                value={formik.values.tipoTurnoId}
                                name="tipoTurnoId"
                                label="Selecione seu turno de trabalho"
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
                                    formik.errors.tipoTurnoId}
                            </FormHelperText>
                        </FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formik.values.administrador}
                                    />
                                }
                                id="administrador"
                                name="administrador"
                                onChange={formik.handleChange}
                                label="Administrador"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    checked={formik.values.ativo}
                                />}
                                id="ativo"
                                name="ativo"
                                onChange={formik.handleChange}
                                label="Ativo"

                            />
                        </FormGroup>
                        <TextField
                            fullWidth
                            id="uuid"
                            name="uuid"
                            label="UUID"
                            value={formik.values.uuid}
                            onChange={formik.handleChange}
                            error={formik.touched.uuid && Boolean(formik.errors.uuid)}
                            helperText={formik.touched.uuid && formik.errors.uuid}
                        />

                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Atualizar
                        </Button>
                    </Box>
                </form>
                <DialogContentText>
                    UUID pode ser deixado em branco, sendo gerado automaticamente.
                </DialogContentText>
                <DialogContentText>
                    A senha do usuário criado será igual ao login.
                </DialogContentText>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        disabled={submitting}
                        autoFocus
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}