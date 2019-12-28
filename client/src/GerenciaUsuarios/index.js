import React, { useState, useEffect } from 'react'
import { Link, withRouter, HashRouter, Route } from 'react-router-dom'
import MaterialTable from 'material-table'

export default withRouter(props => {

  return (
    <MaterialTable
      title="Usuários"
      columns={this.state.columns}
      data={this.state.data}
      localization={{
        pagination: {
          labelDisplayedRows: '{from}-{to} de {count}',
          labelRowsSelect: 'Usuários',
          labelRowsPerPage: 'Usuários por página',
          firstTooltip: 'Primeira página',
          previousTooltip: 'Página anterior',
          nextTooltip: 'Próxima página',
          lastTooltip: 'Última página'
        },
        grouping: {
          placeholder: 'Arraste títulos para agrupar'
        },
        toolbar: {
          nRowsSelected: '{0} usuario(s) selecionada(s)',
          searchTooltip: 'Buscar',
          searchPlaceholder: 'Buscar'
        },
        header: {
          actions: 'Ações'
        },
        body: {
          emptyDataSourceMessage: 'Sem usuários para exibir',
          addTooltip: 'Adicionar usuário',
          deleteTooltip: 'Deletar usuário',
          editTooltip: 'Editar usuário',
          filterRow: {
            filterTooltip: 'Filtro'
          },
          editRow: {
            deleteText: 'Você tem certeza que deseja deletar este usuário?',
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Salvar'
          }
        }
      }}
      actions={[
        {
          icon: 'add',
          tooltip: 'Adicionar usuário',
          isFreeAction: true,
          onClick: (event) => alert("TESTE")
        }
      ]}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              {
                const data = this.state.data;
                data.push(newData);
                this.setState({ data }, () => resolve());
              }
              resolve()
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              {
                const data = this.state.data;
                const index = data.indexOf(oldData);
                data[index] = newData;
                this.setState({ data }, () => resolve());
              }
              resolve()
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              {
                let data = this.state.data;
                const index = data.indexOf(oldData);
                data.splice(index, 1);
                this.setState({ data }, () => resolve());
              }
              resolve()
            }, 1000)
          }),
      }}
    />
  )
})