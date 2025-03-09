// Path: features\users\components\UserResetPasswordDialog.tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useUsers } from '@/hooks/useUsers';

interface UserResetPasswordDialogProps {
  open: boolean;
  title: string;
  msg: string;
  userUUIDs: string[];
  onClose: () => void;
}

const UserResetPasswordDialog = ({
  open,
  title,
  msg,
  userUUIDs,
  onClose,
}: UserResetPasswordDialogProps) => {
  const { resetPasswords, isResettingPasswords } = useUsers();

  const handleResetPasswords = () => {
    if (userUUIDs.length === 0) return;

    resetPasswords(userUUIDs, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-description"
    >
      <DialogTitle id="reset-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="reset-dialog-description">
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isResettingPasswords}>
          Não
        </Button>
        <Button
          onClick={handleResetPasswords}
          color="primary"
          autoFocus
          disabled={isResettingPasswords}
        >
          {isResettingPasswords ? 'Resetando...' : 'Sim'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserResetPasswordDialog;
