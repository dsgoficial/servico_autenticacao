// Path: features\users\components\UserAuthDialog.tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useUsers } from '@/hooks/useUsers';

interface UserAuthDialogProps {
  open: boolean;
  title: string;
  msg: string;
  userUUIDs: string[];
  authorize: boolean;
  onClose: () => void;
}

const UserAuthDialog = ({
  open,
  title,
  msg,
  userUUIDs,
  authorize,
  onClose,
}: UserAuthDialogProps) => {
  const { authorizeUsers, isAuthorizing } = useUsers();

  const handleAuthorizeUsers = () => {
    if (userUUIDs.length === 0) return;

    authorizeUsers(
      { userUuids: userUUIDs, authorize },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-dialog-title"
      aria-describedby="auth-dialog-description"
    >
      <DialogTitle id="auth-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="auth-dialog-description">
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isAuthorizing}>
          Não
        </Button>
        <Button
          onClick={handleAuthorizeUsers}
          color="primary"
          autoFocus
          disabled={isAuthorizing}
        >
          {isAuthorizing ? 'Processando...' : 'Sim'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserAuthDialog;
