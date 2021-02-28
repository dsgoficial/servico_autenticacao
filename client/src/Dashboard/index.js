import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import ReactLoading from 'react-loading'

import UsuariosLogadosDataTable from './usuarios_logados'
import styles from './styles'

import { getDashboardData } from './api'
import { MessageSnackBar, CardGraph, Card, StackedArea } from '../helpers'
import { handleApiError } from '../services'

const Dashboard = withRouter(props => {
  const classes = styles()

  const [snackbar, setSnackbar] = useState('')
  const [loaded, setLoaded] = useState(false)

  const [usuariosAtivos, setUsuariosAtivos] = useState(0)
  const [aplicacoesAtivas, setAplicacoesAtivas] = useState(0)
  const [usuariosLogados, setUsuariosLogados] = useState([])
  const [loginsPorDia, setLoginsPorDia] = useState([])
  const [loginsPorMes, setLoginsPorMes] = useState([])
  const [loginsPorAplicacao, setLoginsPorAplicacao] = useState([])
  const [loginsPorUsuario, setLoginsPorUsuario] = useState([])

  useEffect(() => {
    let isCurrent = true
    const load = async () => {
      try {
        const response = await getDashboardData()
        if (!response || !isCurrent) return
        setUsuariosAtivos(response.usuariosAtivos)
        setAplicacoesAtivas(response.aplicacoesAtivas)
        setUsuariosLogados(response.usuariosLogados)
        setLoginsPorDia(response.loginsPorDia)
        setLoginsPorMes(response.loginsPorMes)
        setLoginsPorAplicacao(response.loginsPorAplicacao)
        setLoginsPorUsuario(response.loginsPorUsuario)
        setLoaded(true)
      } catch (err) {
        if (!isCurrent) return
        handleApiError(err, setSnackbar)
      }
    }
    load()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <>
      {loaded ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <CardGraph label='Logins hoje' series={loginsPorDia} seriesKey='logins' fill='#8dd3c7' />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CardGraph label='Logins este mês' series={loginsPorMes} seriesKey='logins' fill='#bebada' />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card label='Usuários ativos' currentValue={usuariosAtivos} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card label='Aplicações ativas' currentValue={aplicacoesAtivas} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <StackedArea title='Logins por dia por aplicação' series={loginsPorAplicacao} dataKey='data' />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <StackedArea title='Logins por dia por usuário' series={loginsPorUsuario} dataKey='data' />
          </Grid>
          <Grid item xs={12}>
            <UsuariosLogadosDataTable usuarios={usuariosLogados} />
          </Grid>
        </Grid>
      )
        : (
          <div className={classes.loading}>
            <ReactLoading type='bars' color='#F83737' height='5%' width='5%' />
          </div>
        )}
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})

export default Dashboard;