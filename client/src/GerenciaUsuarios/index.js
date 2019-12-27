import React, { useState, useEffect } from 'react'
import { Link, withRouter, HashRouter, Route } from 'react-router-dom'

export default withRouter(props => {

  return (
    <MaterialTable
      title="Usuários"
      columns={this.state.columns}
      data={this.state.data}
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


class Editable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Surname', field: 'surname', initialEditValue: 'initial edit value' },
        { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
        {
          title: 'Birth Place',
          field: 'birthCity',
          lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
        },
      ],
      data: [
        { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
        { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
      ]
    }
  }

  render() {

  }
}