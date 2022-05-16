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
        getAplicacoes,
        atualizaAplicacao,
        deletaAplicacao,
        criaAplicacao
    } = useAPI()

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const [application] = await Promise.all([
                getAplicacoes()
            ])
            setApplication(application)
            setLoaded(true);
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const updateTable = async () => {
        fetchData()
    }

    const addApplication = async newData => {
        try {
            const response = await criaAplicacao(newData)
            if (!response) return
            updateTable()
            showSnackbar('Aplicação adicionada com sucesso', 'success')
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const updateApplication = async (newData, oldData) => {
        try {
            const response = await atualizaAplicacao(newData)
            if (!response) return
            updateTable()
            showSnackbar('Aplicação atualizada com sucesso', 'success')
        } catch (error) {
            showSnackbar(error.message, 'error')
        }
    }

    const deleteApplication = async oldData => {
        try {
            const response = await deletaAplicacao(oldData.id)
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
                                value={props.value || ''}
                                SX={{
                                    width: 500
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
                    onRowAdd: addApplication,
                    onRowUpdate: updateApplication,
                    onRowDelete: deleteApplication
                }}
            />
        </>
    )
}
