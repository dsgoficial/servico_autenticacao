import React from 'react'
import { NavLink } from "react-router-dom"
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import PersonIcon from '@material-ui/icons/Person'
import CreateIcon from '@material-ui/icons/Create'
import GroupIcon from '@material-ui/icons/Group';

import { makeStyles } from '@material-ui/core/styles'

export const mainListItems = (
  <div>
    <ListItem button component={NavLink} to="/">
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary='Informações do usuário' />
    </ListItem>
    <ListItem button button component={NavLink} to="/alterar_senha">
      <ListItemIcon>
        <LockOpenIcon />
      </ListItemIcon>
      <ListItemText primary='Alterar senha' />
    </ListItem>
  </div >
)

export const adminListItems = (
  <div>
    <ListSubheader inset>Administração</ListSubheader>
    <ListItem button component={NavLink} to="/gerenciar_usuarios">
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary='Gerenciar usuários' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText primary='Last quarter' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText primary='Year-end sale' />
    </ListItem>
  </div>
)
