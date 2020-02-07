import React from 'react'
import { MaterialTable } from '../helpers'
import DateFnsUtils from '@date-io/date-fns'

const dateFns = new DateFnsUtils()

export default ({ usuarios }) => {
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
          { title: 'Último login', field: 'ultimo_login', render: rowData => { return dateFns.format(dateFns.date(rowData.ultimo_login), dateFns.time24hFormat) } }
        ]}
        data={usuarios}
      />
    </>
  )
}
