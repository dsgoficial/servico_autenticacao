
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAPI } from '../../contexts/apiContext'
import { useSnackbar } from 'notistack';

export default function UserDeleteDialog({
    open,
    title,
    msg,
    onClose,
    userUUID,
    callback
}) {

    const {
        deleteUser
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const handleDeleteUser = async () => {
        try {
            const data = await deleteUser(userUUID);
            if(!data){
                showSnackbar('Falha ao deletar usuário!', "success")
                return
            }
            showSnackbar(data.message, "success")
            handleClose()
        } catch (error) {
            showSnackbar(error.message, 'error')
        } finally {
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
                <Button onClick={handleDeleteUser}>Sim</Button>
            </DialogActions>
        </Dialog>
    );
}