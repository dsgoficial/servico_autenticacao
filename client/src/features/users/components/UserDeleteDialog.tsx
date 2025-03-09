// Path: features\users\components\UserDeleteDialog.tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useUsers } from '@/hooks/useUsers';

interface UserDeleteDialogProps {
  open: boolean;
  title: string;
  msg: string;
  userUUID: string;
  onClose: () => void;
}

const UserDeleteDialog = ({
  open,
  title,
  msg,
  userUUID,
  onClose,
}: UserDeleteDialogProps) => {
  const { deleteUser, isDeleting } = useUsers();

  const handleDeleteUser = () => {
    if (!userUUID) return;

    deleteUser(userUUID, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Não
        </Button>
        <Button
          onClick={handleDeleteUser}
          color="error"
          autoFocus
          disabled={isDeleting}
        >
          {isDeleting ? 'Excluindo...' : 'Sim'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDeleteDialog;
