// Path: features\applications\components\ApplicationsManageTable.tsx
import React from 'react';
import { Box, TextField, Chip, Alert } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Application } from '@/types/application';
import { useApplications } from '@/hooks/useApplications';
import { Table } from '@/components/ui/Table';
import Loading from '@/components/ui/Loading';

export const ApplicationsManageTable: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    applications,
    isLoading,
    isError,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
  } = useApplications();

  // Table columns definition
  const columns = [
    {
      id: 'nome',
      label: 'Aplicação',
      align: 'left' as const,
      sortable: true,
      priority: 5,
      format: (value: string) => value,
    },
    {
      id: 'nome_abrev',
      label: 'Nome abreviado',
      align: 'left' as const,
      sortable: true,
      priority: 4,
    },
    {
      id: 'ativa',
      label: 'Ativa',
      align: 'center' as const,
      sortable: true,
      priority: 4,
      format: (value: boolean) => (
        <Chip 
          label={value ? "Sim" : "Não"} 
          color={value ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  // Handle create application
  const handleAddApplication = async (newData: any) => {
    try {
      await createApplication({
        nome: newData.nome,
        nome_abrev: newData.nome_abrev || '',
        ativa: newData.ativa === false ? false : true,
      });
    } catch (error) {
      enqueueSnackbar('Erro ao criar aplicação', { variant: 'error' });
    }
  };

  // Handle update application
  const handleUpdateApplication = async (newData: Application) => {
    try {
      await updateApplication({
        id: newData.id,
        nome: newData.nome,
        nome_abrev: newData.nome_abrev,
        ativa: newData.ativa,
      });
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar aplicação', { variant: 'error' });
    }
  };

  // Handle delete application
  const handleDeleteApplication = async (oldData: Application) => {
    try {
      await deleteApplication(oldData.id);
    } catch (error) {
      enqueueSnackbar('Erro ao remover aplicação', { variant: 'error' });
    }
  };

  // If there's an error, display it
  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Erro ao carregar aplicações: {error}
      </Alert>
    );
  }

  // If loading and no data yet
  if (isLoading && applications.length === 0) {
    return <Loading />;
  }

  // Custom editor component that safely extracts needed props
  const CustomEditField = (props: any) => {
    const { columnDef, value, onChange, fallback } = props;
    
    if (!columnDef || !columnDef.field) {
      return fallback;
    }
    
    switch (columnDef.field) {
      case 'nome':
        return (
          <TextField
            fullWidth
            variant="outlined"
            label="Nome da aplicação"
            placeholder="Nome da aplicação"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            margin="normal"
          />
        );
      case 'nome_abrev':
        return (
          <TextField
            fullWidth
            variant="outlined"
            label="Nome abreviado"
            placeholder="Nome abreviado"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            margin="normal"
          />
        );
      case 'ativa':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={value === true ? "true" : value === false ? "false" : "true"}
              onChange={(e) => onChange(e.target.value === "true")}
              SelectProps={{
                native: true,
              }}
            >
              <option value="true">Ativa</option>
              <option value="false">Inativa</option>
            </TextField>
          </Box>
        );
      default:
        return fallback;
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Table
        title="Aplicações"
        columns={columns}
        rows={applications}
        isLoading={isLoading}
        emptyMessage="Nenhuma aplicação cadastrada."
        searchPlaceholder="Buscar aplicação..."
        stickyHeader
        editable={{
          isEditable: () => true,
          isDeletable: () => true,
          onRowAdd: handleAddApplication,
          onRowUpdate: handleUpdateApplication,
          onRowDelete: handleDeleteApplication,
          editTooltip: 'Editar aplicação',
          deleteTooltip: 'Remover aplicação',
          addTooltip: 'Adicionar aplicação',
        }}
        options={{
          selection: false,
          exportButton: true,
          actionsColumnIndex: -1,
          paging: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          padding: 'dense',
          headerStyle: {
            fontWeight: 'bold',
          },
        }}
        components={{
          EditField: CustomEditField
        }}
      />
    </Box>
  );
};