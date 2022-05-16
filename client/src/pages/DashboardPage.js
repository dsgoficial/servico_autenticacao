import React, { useState, useMemo, useEffect } from "react";
import { Container, Grid } from '@mui/material';
import Page from '../components/Page';
import { useAPI } from '../contexts/apiContext'
import { useSnackbar } from 'notistack';
import Loading from '../components/Loading';
import { CardGraph, StackedArea, LoginsDataTable, Card } from '../sections/@dashboard';

export default function DashboardPage() {

    const {
        getDashboardData
    } = useAPI()

    const [loaded, setLoaded] = useState(false)

    const [usuariosAtivos, setUsuariosAtivos] = useState(0)
    const [aplicacoesAtivas, setAplicacoesAtivas] = useState(0)
    const [usuariosLogados, setUsuariosLogados] = useState([])
    const [loginsPorDia, setLoginsPorDia] = useState([])
    const [loginsPorMes, setLoginsPorMes] = useState([])
    const [loginsPorAplicacao, setLoginsPorAplicacao] = useState([])
    const [loginsPorUsuario, setLoginsPorUsuario] = useState([])

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getDashboardData()
                setUsuariosAtivos(response.usuariosAtivos)
                setAplicacoesAtivas(response.aplicacoesAtivas)
                setUsuariosLogados(response.usuariosLogados)
                setLoginsPorDia(response.loginsPorDia)
                setLoginsPorMes(response.loginsPorMes)
                setLoginsPorAplicacao(response.loginsPorAplicacao)
                setLoginsPorUsuario(response.loginsPorUsuario)
                setLoaded(true)
            } catch (error) {
                showSnackbar(error.message, 'error')
            }
        }
        load()
    }, [])

    const showSnackbar = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };


    return (
        <Page title="Sistema de Apoio à Produção">
            {loaded ? (
                <Grid container spacing={3} sx={{ paddingLeft: 2, paddingRight: 2 }}>
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
                        <LoginsDataTable usuarios={usuariosLogados} />
                    </Grid>
                </Grid>
            )
                : <Loading />
            }
        </Page>
    );
}