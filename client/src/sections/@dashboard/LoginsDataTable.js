import React from "react";
import MaterialTable from '../../components/Table';
import { format } from 'date-fns'

export default function LoginsDataTable({usuarios}) {

    return (
        <>
            <MaterialTable
                title='Usuários logados hoje'
                loaded
                columns={[
                    { title: 'Login', field: 'login' },
                    { title: 'Posto/Graducao', field: 'tipo_posto_grad' },
                    { title: 'Turno', field: 'tipo_turno' },
                    { title: 'Nome Guerra', field: 'nome_guerra' },
                    { title: 'Aplicação', field: 'aplicacao' },
                    { title: 'Último login', field: 'ultimo_login', render: rowData => format(new Date(rowData.ultimo_login), "yyyy-MM-dd -- HH:mm:ss") }
                ]}
                data={usuarios}
            />
        </>
    )
}
