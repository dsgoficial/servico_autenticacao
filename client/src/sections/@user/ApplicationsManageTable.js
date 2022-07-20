import React, { useState, useMemo, useEffect } from "react";
import MaterialTable from '../../components/Table';
import {
    TextField
} from '@mui/material';
import { useAPI } from '../../contexts/apiContext'
import { useSnackbar } from 'notistack';

export default function ManageApplicationsTable() {

    const [application, setApplication] = useState([])
    const [loaded, setLoaded] = useState(false)

    const {
        getApplications,
        updateApplication,
        deleteApplication,
        createApplication
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const data = await getApplications()
        if (!data?.dados) {
            showSnackbar('Falha ao obter dados!', 'error')
            setLoaded(true);
            return
        }
        setApplication(data.dados)
        setLoaded(true);
    }

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const updateTable = async () => {
        fetchData()
    }

    const handleCreateApplication = async newData => {
        try {
            const response = await createApplication(newData)
            if (!response) return
            updateTable()
            showSnackbar('Aplicação adicionada com sucesso', 'success')
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const handleUpdateApplication = async (newData, oldData) => {
        try {
            const response = await updateApplication(newData)
            if (!response) return
            updateTable()
            showSnackbar('Aplicação atualizada com sucesso', 'success')
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const handleDeleteApplication = async oldData => {
        try {
            const response = await deleteApplication(oldData.id)
            if (!response) return
            updateTable()
            showSnackbar('Aplicação deletada com sucesso', 'success')
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    return (
        <>
            <MaterialTable
                title='Aplicações'
                loaded={loaded}
                columns={[
                    {
                        title: 'Aplicação',
                        field: 'nome',
                        editComponent: props => (
                            <TextField
                                type='text'
                                placeholder='Nome aplicação'
                                value={props.value || ''}
                                sx={{
                                    width: 300
                                }}
                                onChange={e => props.onChange(e.target.value)}
                            />
                        )
                    },
                    { title: 'Nome abreviado', field: 'nome_abrev' },
                    { title: 'Ativa', field: 'ativa', type: 'boolean' }
                ]}
                data={application}
                editable={{
                    onRowAdd: handleCreateApplication,
                    onRowUpdate: handleUpdateApplication,
                    onRowDelete: handleDeleteApplication
                }}
            />
        </>
    )
}
