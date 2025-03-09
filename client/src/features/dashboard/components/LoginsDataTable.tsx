// Path: features\dashboard\components\LoginsDataTable.tsx
import { useMemo } from 'react';
import { Paper } from '@mui/material';
import { Table } from '@/components/ui/Table';
import { LoggedInUser } from '@/types/dashboard';
import { formatDate } from '@/utils/formatters';

interface LoginsDataTableProps {
  usuarios: LoggedInUser[];
  isLoading?: boolean;
}

export const LoginsDataTable = ({
  usuarios,
  isLoading = false,
}: LoginsDataTableProps) => {
  // Define table columns
  const columns = useMemo(
    () => [
      {
        id: 'login',
        label: 'Login',
        align: 'left' as const,
        minWidth: 100,
        sortable: true,
        priority: 5,
      },
      {
        id: 'tipo_posto_grad',
        label: 'Posto/Graduação',
        align: 'left' as const,
        priority: 4,
      },
      {
        id: 'tipo_turno',
        label: 'Turno',
        align: 'left' as const,
        priority: 3,
      },
      {
        id: 'nome_guerra',
        label: 'Nome Guerra',
        align: 'left' as const,
        priority: 4,
      },
      {
        id: 'aplicacao',
        label: 'Aplicação',
        align: 'left' as const,
        priority: 3,
      },
      {
        id: 'ultimo_login',
        label: 'Último login',
        align: 'right' as const,
        format: (value: string) => formatDate(value),
        priority: 4,
      },
    ],
    [],
  );

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
      <Table
        title="Usuários logados hoje"
        columns={columns}
        rows={usuarios}
        isLoading={isLoading}
        emptyMessage="Nenhum usuário logado hoje"
        stickyHeader
        pagination={{
          page: 1,
          rowsPerPage: 10,
          totalRows: usuarios.length,
          onPageChange: () => {},
        }}
      />
    </Paper>
  );
};
