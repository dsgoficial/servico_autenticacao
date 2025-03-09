// Path: features\users\components\UsersManageTable.tsx
import { useState } from 'react';
import { CsvBuilder } from 'filefy';
import { Table } from '@/components/ui/Table';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types/user';
import UserAddDialog from './UserAddDialog';
import UserEditDialog from './UserEditDialog';
import UserDeleteDialog from './UserDeleteDialog';
import { useUserStore } from '@/stores/userStore';
import Loading from '@/components/ui/Loading';
import { Edit, Delete, Add } from '@mui/icons-material';
import { MouseEvent } from 'react';

const UsersManageTable = () => {
  const { users, isLoading } = useUsers();
  const { selectedUsers, selectUsers } = useUserStore();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    open: boolean;
    title?: string;
    msg?: string;
    userUUID?: string;
  }>({ open: false });

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);

  const [openEditDialog, setOpenEditDialog] = useState<{
    open: boolean;
    user?: User;
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
    {
      id: 'administrador',
      label: 'Administrador',
      align: 'center' as const,
      sortable: true,
      priority: 4,
      format: (value: boolean) => (value ? 'Sim' : 'Não'),
    },
  ];

  const handleAddUser = () => {
    setOpenAddDialog(true);
  };

  const handleEditUser = (user: User) => {
    setOpenEditDialog({
      open: true,
      user,
    });
  };

  const handleDeleteUser = (user: User) => {
    setOpenDeleteDialog({
      open: true,
      title: 'Deletar usuário',
      msg: `Deseja realmente deletar o usuário ${user.tipo_posto_grad} ${user.nome_guerra}?`,
      userUUID: user.uuid,
    });
  };

  const handleSelectionChange = (rows: User[]) => {
    selectUsers(rows);
  };

  const actions = [
    {
      icon: <Edit />,
      tooltip: 'Editar usuário',
      onClick: (_: MouseEvent<HTMLButtonElement>, selectedRows: User[]) => {
        if (selectedRows && selectedRows.length > 0) {
          handleEditUser(selectedRows[0]);
        }
      },
    },
    {
      icon: <Delete />,
      tooltip: 'Deletar usuário',
      onClick: (_: MouseEvent<HTMLButtonElement>, selectedRows: User[]) => {
        if (selectedRows && selectedRows.length > 0) {
          handleDeleteUser(selectedRows[0]);
        }
      },
    },
    {
      icon: <Add />,
      tooltip: 'Adicionar usuário',
      isFreeAction: true,
      onClick: () => handleAddUser(),
    },
  ];

  // Custom export function to be used with the exportData prop
  const exportToCSV = (data: User[]) => {
    const keys = [
      'login',
      'tipo_posto_grad',
      'tipo_turno',
      'nome_guerra',
      'nome',
      'ativo',
      'administrador',
    ];
    const headers = [
      'Login',
      'Posto/Graduação',
      'Turno',
      'Nome Guerra',
      'Nome completo',
      'Ativo',
      'Administrador',
    ];

    const dataToExport = data.map(row =>
      keys.map(key => {
        const value = row[key as keyof User];
        // Convert to string to fix type mismatch
        if (typeof value === 'boolean') {
          return value ? 'Sim' : 'Não';
        }
        return value ? String(value) : '';
      }),
    );

    new CsvBuilder('export_usuarios.csv')
      .setDelimeter(',')
      .setColumns(headers)
      .addRows(dataToExport)
      .exportFile();
  };

  if (isLoading && users.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <Table
        title="Usuários"
        columns={columns}
        rows={users}
        isLoading={isLoading}
        rowKey={row => row.uuid}
        actions={actions}
        emptyMessage="Nenhum usuário encontrado"
        searchPlaceholder="Buscar usuário..."
        options={{
          exportButton: true,
          selection: true,
        }}
        onSelectionChange={handleSelectionChange}
        selectedRows={selectedUsers}
        exportData={exportToCSV}
      />

      {/* Dialogs */}
      <UserAddDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />

      <UserEditDialog
        open={openEditDialog.open}
        user={openEditDialog.user}
        onClose={() => setOpenEditDialog({ open: false })}
      />

      <UserDeleteDialog
        open={openDeleteDialog.open}
        title={openDeleteDialog.title || ''}
        msg={openDeleteDialog.msg || ''}
        onClose={() => setOpenDeleteDialog({ open: false })}
        userUUID={openDeleteDialog.userUUID || ''}
      />
    </>
  );
};

export default UsersManageTable;
