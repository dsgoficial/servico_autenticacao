import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import MenuIcon from '@material-ui/icons/Menu'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import styles from './styles'
import { mainListItems, adminListItems } from './list_items'
import { handleLogout } from './api.js'

import InformacaoUsuario from '../InformacaoUsuario'

export default withRouter(props => {
  const classes = styles()

  const [open, setOpen] = useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const clickLogout = () => {
    handleLogout()
    props.history.push('/login')
  }

  return (
    <div className={classes.root}>
      <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
            Serviço de Autenticação
          </Typography>
          <IconButton color='inherit' onClick={clickLogout}>
            <Typography variant='h6' color='inherit' noWrap className={classes.title}>
              Sair
            </Typography>
            <ExitToAppIcon className={classes.logoutButton} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        {props.role === 'ADMIN' &&
          <>
            <Divider />
            <List>{adminListItems}</List>
          </>
        }
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth='lg' className={classes.container}><InformacaoUsuario /></Container>
      </main>
    </div>
  )
})
