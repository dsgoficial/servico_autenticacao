
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAPI } from '../../contexts/apiContext'
import { useSnackbar } from 'notistack';

export default function UserAuthDialog({
    open,
    title,
    msg,
    onClose,
    userUUIDs,
    authorize,
    callback
}) {

    const {
        authorizeUsers
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const handleAuthorizeUsers = async () => {
        try {
            const data = await authorizeUsers(userUUIDs, authorize);
            if(!data){
                showSnackbar(`Falha ao ${authorize? 'autorizar': 'desautorizar'} usuários!`, 'error')
                return
            }
            showSnackbar(`Usuários ${authorize? 'autorizados': 'desautorizados'} com sucesso!`, "success")
        } catch (error) {
            showSnackbar(error.message, 'error')
        } finally {
            handleClose()
            callback()
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {msg}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Não</Button>
                <Button onClick={handleAuthorizeUsers}>Sim</Button>
            </DialogActions>
        </Dialog>
    );
}