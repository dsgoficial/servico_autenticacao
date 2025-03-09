// Path: features\users\components\UsersAuthTable.tsx
import { useState } from 'react';
import { Table } from '@/components/ui/Table';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types/user';
import UserAuthDialog from './UserAuthDialog';
import UserResetPasswordDialog from './UserResetPasswordDialog';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useUserStore } from '@/stores/userStore';
import Loading from '@/components/ui/Loading';
import { MouseEvent } from 'react';

const UsersAuthTable = () => {
  const { users, isLoading } = useUsers();
  const { selectedUsers, selectUsers } = useUserStore();

  // Filter out admin users for this view
  const nonAdminUsers = users.filter(user => !user.administrador);

  const [openAuthDialog, setOpenAuthDialog] = useState<{
    open: boolean;
    title?: string;
    msg?: string;
    userUUIDs?: string[];
    authorize?: boolean;
  }>({ open: false });

  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState<{
    open: boolean;
    title?: string;
    msg?: string;
    userUUIDs?: string[];
  }>({ open: false });

  const columns = [
    {
      id: 'login',
      label: 'Login',
      align: 'left' as const,
      sortable: true,
      priority: 5,
    },
    {
      id: 'tipo_posto_grad',
      label: 'Posto/Graduação',
      align: 'left' as const,
      sortable: true,
      priority: 4,
    },
    {
      id: 'tipo_turno',
      label: 'Turno',
      align: 'left' as const,
      sortable: true,
      priority: 3,
    },
    {
      id: 'nome_guerra',
      label: 'Nome Guerra',
      align: 'left' as const,
      sortable: true,
      priority: 4,
    },
    {
      id: 'nome',
      label: 'Nome completo',
      align: 'left' as const,
      sortable: true,
      priority: 3,
    },
    {
      id: 'ativo',
      label: 'Ativo',
      align: 'center' as const,
      sortable: true,
      priority: 4,
      format: (value: boolean) => (value ? 'Sim' : 'Não'),
    },
  ];

  const handleAddAuth = (selectedUsers: User[]) => {
    if (selectedUsers.length === 0) return;

    setOpenAuthDialog({
      open: true,
      title: 'Autorizar usuários',
      msg: 'Deseja realmente autorizar os usuários selecionados?',
      userUUIDs: selectedUsers.map(u => u.uuid),
      authorize: true,
    });
  };

  const handleRemoveAuth = (selectedUsers: User[]) => {
    if (selectedUsers.length === 0) return;

    setOpenAuthDialog({
      open: true,
      title: 'Remover autorização',
      msg: 'Deseja realmente remover a autorização dos usuários selecionados?',
      userUUIDs: selectedUsers.map(u => u.uuid),
      authorize: false,
    });
  };

  const handleResetPassword = (selectedUsers: User[]) => {
    if (selectedUsers.length === 0) return;

    setOpenResetPasswordDialog({
      open: true,
      title: 'Resetar senhas',
      msg: 'Deseja realmente resetar a senha dos usuários selecionados?',
      userUUIDs: selectedUsers.map(u => u.uuid),
    });
  };

  const handleSelectionChange = (rows: User[]) => {
    selectUsers(rows);
  };

  // Define conditional actions based on user status
  const getRowActions = (row: User) => {
    const actions = [];
    
    // Show "Autorizar usuário" button only for inactive users
    if (!row.ativo) {
      actions.push({
        icon: <DoneAllIcon />,
        tooltip: 'Autorizar usuário',
        onClick: (_: MouseEvent<HTMLButtonElement>, rows: User[]) => handleAddAuth(rows),
      });
    }
    
    // Show "Remover autorização" button only for active users
    if (row.ativo) {
      actions.push({
        icon: <RemoveCircleOutlineIcon />,
        tooltip: 'Remover autorização',
        onClick: (_: MouseEvent<HTMLButtonElement>, rows: User[]) => handleRemoveAuth(rows),
      });
    }
    
    // Always show "Resetar senha" button for all users
    actions.push({
      icon: <LockOpenIcon />,
      tooltip: 'Resetar senha',
      onClick: (_: MouseEvent<HTMLButtonElement>, rows: User[]) => handleResetPassword(rows),
    });
    
    return actions;
  };

  if (isLoading && nonAdminUsers.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <Table
        title="Autorização de Usuários"
        columns={columns}
        rows={nonAdminUsers}
        isLoading={isLoading}
        rowKey={row => row.uuid}
        actionGetter={getRowActions}
        emptyMessage="Nenhum usuário encontrado"
        searchPlaceholder="Buscar usuário..."
        options={{
          selection: true,
        }}
        onSelectionChange={handleSelectionChange}
        selectedRows={selectedUsers}
      />

      {/* Dialogs */}
      <UserAuthDialog
        open={openAuthDialog.open}
        title={openAuthDialog.title || ''}
        msg={openAuthDialog.msg || ''}
        onClose={() => setOpenAuthDialog({ open: false })}
        userUUIDs={openAuthDialog.userUUIDs || []}
        authorize={openAuthDialog.authorize || false}
      />

      <UserResetPasswordDialog
        open={openResetPasswordDialog.open}
        title={openResetPasswordDialog.title || ''}
        msg={openResetPasswordDialog.msg || ''}
        onClose={() => setOpenResetPasswordDialog({ open: false })}
        userUUIDs={openResetPasswordDialog.userUUIDs || []}
      />
    </>
  );
};

export default UsersAuthTable;