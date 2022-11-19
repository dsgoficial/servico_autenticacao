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
    basedn: yup
        .string('Informe o Base Distinguished Name (Base DN)')
        .required('Campo obrigatório'),
    ldapurl: yup
        .string('Informe a URL do seriço LDAP')
        .required('Campo obrigatório'),
});

export default function LDAPInfoCard() {

    const {
        getLDAPUsers
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const onSubmit = async (values) => {
        const data = await getLDAPUsers(
            values.basedn,
            values.ldapurl
        );
        const users = data.dados.map(({cn,sn,givenName}) => {
            cn = "ldap:"+cn;
            return {cn,sn,givenName}
        }); 
        console.log(users);
        showSnackbar(users.length+' usuários encontrados com sucesso!', 'success')
    }

    const formik = useFormik({
        initialValues: {
            basedn: 'dc=eb,dc=mil,dc=br',
            ldapurl: 'ldap://localhost:389',
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
                        }}
                    >
                        <TextField
                            fullWidth
                            id="basedn"
                            name="basedn"
                            label="Base Distinguished Name (DN)"
                            value={formik.values.basedn}
                            onChange={formik.handleChange}
                            error={formik.touched.basedn && Boolean(formik.errors.basedn)}
                            helperText={formik.touched.basedn && formik.errors.basedn}
                        />
                        <TextField
                            fullWidth
                            id="ldapurl"
                            name="ldapurl"
                            label="URI do serviço LDAP"
                            value={formik.values.ldapurl}
                            onChange={formik.handleChange}
                            error={formik.touched.ldapurl && Boolean(formik.errors.ldapurl)}
                            helperText={formik.touched.ldapurl && formik.errors.ldapurl}
                        />
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Trazer usuários
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
}