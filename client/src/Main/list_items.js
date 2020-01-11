import React from 'react'
import { NavLink } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import LockIcon from '@material-ui/icons/Lock'
import PersonIcon from '@material-ui/icons/Person'
import GroupIcon from '@material-ui/icons/Group'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import InsertChartIcon from '@material-ui/icons/InsertChart'
import DesktopMacIcon from '@material-ui/icons/DesktopMac'
import Tooltip from '@material-ui/core/Tooltip'

import styles from './styles'

export const MainListItems = props => {
  const classes = styles()

  return (
    <List>
      <Divider />
      <Tooltip title='Informações do usuário' placement='right-start'>
        <ListItem button component={NavLink} replace exact to='/' activeClassName={classes.active}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary='Informações do usuário' />
        </ListItem>
      </Tooltip>

      <Tooltip title='Alterar senha' placement='right-start'>
        <ListItem button component={NavLink} replace exact to='/alterar_senha' activeClassName={classes.active}>
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary='Alterar senha' />
        </ListItem>
      </Tooltip>

    </List>
  )
}

export const AdminListItems = props => {
  const classes = styles()

  return (
    <List>
      <Divider />
      <ListSubheader inset>Administração</ListSubheader>

      <Tooltip title='Dashboard' placement='right-start'>
        <ListItem button component={NavLink} replace exact to='/dashboard' activeClassName={classes.active}>
          <ListItemIcon>
            <InsertChartIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>
      </Tooltip>

      <Tooltip title='Gerenciar usuários' placement='right-start'>
        <ListItem button component={NavLink} replace exact to='/gerenciar_usuarios' activeClassName={classes.active}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary='Gerenciar usuários' />
        </ListItem>
      </Tooltip>

      <Tooltip title='Autorizar usuários' placement='right-start'>
        <ListItem button component={NavLink} replace exact to='/autorizar_usuarios' activeClassName={classes.active}>
          <ListItemIcon>
            <VerifiedUserIcon />
          </ListItemIcon>
          <ListItemText primary='Autorizar usuários' />
        </ListItem>
      </Tooltip>

      <Tooltip title='Gerenciar aplicações' placement='right-start'>
        <ListItem button component={NavLink} replace exact to='/gerenciar_aplicacoes' activeClassName={classes.active}>
          <ListItemIcon>
            <DesktopMacIcon />
          </ListItemIcon>
          <ListItemText primary='Gerenciar aplicações' />
        </ListItem>
      </Tooltip>

    </List>
  )
}
