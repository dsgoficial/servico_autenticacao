import React, { useState, useMemo, useEffect } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { CsvBuilder } from "filefy";
import MaterialTable from '../../components/Table';
import UserAuthDialog from './UserAuthDialog'
import UserResetPasswordDialog from './UserResetPasswordDialog'
import { useAPI } from '../../contexts/apiContext'
import { useSnackbar } from 'notistack';

export default function AuthUsersTable() {

    const [usuarios, setUsuarios] = useState([])
    const [openAuthDialog, setOpenAuthDialog] = useState({})
    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState({})
    const [loaded, setLoaded] = useState(false)

    const {
        getUsuarios
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const [usuarios] = await Promise.all([
                getUsuarios()
            ])
            setUsuarios(usuarios.filter(user => !user.administrador))
            setLoaded(true);
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const showAddAuth = (event, data) => {
        setOpenAuthDialog({
            open: true,
            title: 'Autorizar usuários',
            msg: 'Deseja realmente autorizar os usuários selecionados?',
            userUUIDs: data.map(d => (d.uuid)),
            authorize: true,
            onClose: () => setOpenAuthDialog({})
        })
    }

    const showRemoveAuth = (event, data) => {
        setOpenAuthDialog({
            open: true,
            title: 'Remover autorização',
            msg: 'Deseja realmente remover a autorização dos usuários selecionados?',
            userUUIDs: data.map(d => (d.uuid)),
            authorize: false,
            onClose: () => setOpenAuthDialog({})
        })
    }

    const showResetPassword = (event, data) => {
        setOpenResetPasswordDialog({
            open: true,
            title: 'Reseta senhas',
            msg: 'Deseja realmente resetar a senha dos usuários selecionados?',
            userUUIDs: data.map(d => (d.uuid)),
            onClose: () => setOpenResetPasswordDialog({})
        })
    }

    const updateTable = async () => {
        fetchData()
    }

    return (
        <>
            <MaterialTable
                title='Usuários'
                loaded={loaded}
                columns={[
                    { title: 'Login', field: 'login' },
                    { title: 'Posto/Graducao', field: 'tipo_posto_grad' },
                    { title: 'Turno', field: 'tipo_turno' },
                    { title: 'Nome Guerra', field: 'nome_guerra' },
                    { title: 'Nome completo', field: 'nome' },
                    { title: 'Ativo', field: 'ativo', type: 'boolean' },
                    { title: 'Administrador', field: 'administrador', type: 'boolean' }
                ]}
                data={usuarios}
                actions={[
                    {
                        icon: DoneAllIcon,
                        tooltip: 'Autorizar usuário',
                        onClick: showAddAuth
                    },
                    {
                        icon: RemoveCircleOutlineIcon,
                        tooltip: 'Remover autorização',
                        onClick: showRemoveAuth
                    },
                    {
                        icon: LockOpenIcon,
                        tooltip: 'Resetar senha',
                        onClick: showResetPassword
                    }
                ]}
                options={{
                    selection: true
                }}
            />
            {openAuthDialog ? (
                <UserAuthDialog
                    open={openAuthDialog.open}
                    title={openAuthDialog.title}
                    msg={openAuthDialog.msg}
                    onClose={openAuthDialog.onClose}
                    userUUIDs={openAuthDialog.userUUIDs}
                    authorize={openAuthDialog.authorize}
                    callback={updateTable}
                />
            ) : null}
            {openResetPasswordDialog ? (
                <UserResetPasswordDialog
                    open={openResetPasswordDialog.open}
                    title={openResetPasswordDialog.title}
                    msg={openResetPasswordDialog.msg}
                    onClose={openResetPasswordDialog.onClose}
                    userUUIDs={openResetPasswordDialog.userUUIDs}
                    callback={updateTable}
                />
            ) : null}
        </>
    )
}
