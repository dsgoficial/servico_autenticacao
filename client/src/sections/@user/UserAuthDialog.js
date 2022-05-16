
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
        autorizarUsuarios
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const authUser = async () => {
        try {
            const res = await autorizarUsuarios(userUUIDs, authorize);
            showSnackbar(res.data.message, "success")
            callback()
            handleClose()
        } catch (error) {
            showSnackbar(error.message, 'error')
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
                <Button onClick={authUser}>Sim</Button>
            </DialogActions>
        </Dialog>
    );
}