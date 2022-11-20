import React, { useState, useEffect } from 'react'
import {
    Typography,
    CardContent,
    Card,
    Stack,
    TextField,
    Button,
    Box
} from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import SaveIcon from '@mui/icons-material/Save';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LoadingButton from '@mui/lab/LoadingButton';
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

    const [progress, setprogress] = useState(0);

    const [saveloading, setsaveLoading] = useState(false);

    const [searchusersloading, setsearchusersLoading] = useState(false);

    const {
        getLDAPUsers,
        saveLDAPenv,
        getLDAPenv
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const onSubmit = async (values) => {
        setsearchusersLoading(true);
        // TODO:loading icon not loading...
        const data = await getLDAPUsers(
            values.basedn,
            values.ldapurl
        );
        if ('errno' in data.dados){
            var msg = 'Erro: ';
            for (const [key, value] of Object.entries(data.dados)) {
                msg += `${value} `;
              }
            showSnackbar(msg, 'error');
        }else{
            const users = data.dados.map(({cn,sn,givenName}) => {
                cn = "ldap:"+cn;
                return {cn,sn,givenName}
            }); 
            console.log(users);
            showSnackbar(users.length+' usuários encontrados com sucesso!', 'success');
        }
        setsearchusersLoading(false);
    }

    const formik = useFormik({
        initialValues: {
            basedn: 'dc=eb,dc=mil,dc=br',
            ldapurl: 'ldap://localhost:389',
        },
        validationSchema: validationSchema,
        onSubmit: onSubmit,
    });

    function SaveButton(props) {
        const {
            color,
            onClick,
            loadingPosition,
            startIcon,
            variant,
            children
        } = props;

        return (
        <LoadingButton
            color={color}
            onClick={onClick}
            loadingPosition={loadingPosition}
            loading={saveloading}
            startIcon={startIcon}
            variant={variant}>
            {children}
        </LoadingButton>
        );
    }

    function SearchButton(props) {

        return (
            <LoadingButton
                color="primary" 
                loading={searchusersloading}
                startIcon={<PersonSearchIcon />}
                variant="contained" 
                type="submit">
                Procurar usuários
        </LoadingButton>
        );
    }

    useEffect(async () => {
        const ldapenv = await getLDAPenv();
        if ('dados' in ldapenv){
            if ('basedn' in ldapenv.dados && 'ldapurl' in ldapenv.dados){
                formik.setFieldValue('basedn',ldapenv.dados.basedn);
                formik.setFieldValue('ldapurl',ldapenv.dados.ldapurl);
            }
        }
        console.log(ldapenv.dados);
    }, []);

    const handleSaveClick = async () =>{
        setsaveLoading(true);
        const data = await saveLDAPenv(formik.values.basedn,formik.values.ldapurl);
        showSnackbar(data.dados, 'success');
        setsaveLoading(false);
    }
    
    function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(props.value,)}%`}
                </Typography>
            </Box>
        </Box>
    );
    }
    
    const SyncLDAPClick = () =>{
        setprogress(progress+1);
        console.log(formik.values.basedn);
        console.log(formik.values.ldapurl);
    }
    
    function LinearWithValueLabel() {
        var sx = { width: '100%' };
        if (progress===0){
            sx = { width: '100%' , visibility:'hidden'};
        }
        return (
            <Box sx={sx}>
            <LinearProgressWithLabel value={progress} />
            </Box>
        );
    }

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
                    Configurar serviço LDAP
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
                    </Stack>
                    <Box sx={{ '& > button': { m: 1 } }}>
                        <SaveButton
                            color="success"
                            onClick={handleSaveClick}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained">
                            Salvar
                        </SaveButton>
                        <SearchButton />
                        <Button color="warning" variant="contained" onClick={SyncLDAPClick}>
                            Trazer usuários
                        </Button>
                    </Box>
                    <LinearWithValueLabel />
                </form>
            </CardContent>
        </Card>
    );
}