import PropTypes from 'prop-types';
import { useEffect, useState, lazy } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import {
    Typography,
    List,
    Divider,
    IconButton,
    ListItemText,
    ListItemButton,
    Tooltip
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock'
import GroupIcon from '@mui/icons-material/Group'
import InsertChartIcon from '@mui/icons-material/InsertChart'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import DesktopMacIcon from '@mui/icons-material/DesktopMac'

import { useAPI } from '../../contexts/apiContext'
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 280

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MarketplaceSidebar({ isOpenSidebar, onCloseSidebar }) {

    const theme = useTheme();

    const { pathname } = useLocation();

    const {
        isAdmin
    } = useAPI()

    const routers = {
        'userInfo': '/',
        'userPassword': '/alterar_senha',
        'manageUsers': '/gerenciar_usuarios',
        'dashboard': '/dashboard',
        'authUser': '/autorizar_usuarios',
        'manageApplications': '/gerenciar_aplicacoes'
    }

    useEffect(() => {
        if (isOpenSidebar) {
            onCloseSidebar();
        }
    }, [pathname]);

    const getAdminItems = () => {
        return (
            <>
                <Tooltip title="Dashboard">
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isOpenSidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={RouterLink}
                        to={routers['dashboard']}
                        selected={routers['dashboard'] == pathname}
                    >

                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isOpenSidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <InsertChartIcon />
                        </ListItemIcon>

                        <ListItemText primary={'Dashboard'} sx={{ opacity: isOpenSidebar ? 1 : 0 }} />
                    </ListItemButton>
                </Tooltip>

                <Tooltip title="Gerenciar usuários">
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isOpenSidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={RouterLink}
                        to={routers['manageUsers']}
                        selected={routers['manageUsers'] == pathname}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isOpenSidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Gerenciar usuários'} sx={{ opacity: isOpenSidebar ? 1 : 0 }} />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Autorizar usuários">
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isOpenSidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={RouterLink}
                        to={routers['authUser']}
                        selected={routers['authUser'] == pathname}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isOpenSidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <VerifiedUserIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Autorizar usuários'} sx={{ opacity: isOpenSidebar ? 1 : 0 }} />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Gerenciar aplicações">
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isOpenSidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={RouterLink}
                        to={routers['manageApplications']}
                        selected={routers['manageApplications'] == pathname}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isOpenSidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <DesktopMacIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Gerenciar aplicações'} sx={{ opacity: isOpenSidebar ? 1 : 0 }} />
                    </ListItemButton>
                </Tooltip>
            </>
        )
    }

    return (
        <Drawer variant="permanent" open={isOpenSidebar}>
            <DrawerHeader>
                <Typography
                    sx={{
                        flexGrow: 1,
                        textAlign: 'center'
                    }}
                    variant="h6"
                >
                    Menu
                </Typography>
                <IconButton onClick={onCloseSidebar}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <Tooltip title="Informações do usuário">
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isOpenSidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={RouterLink}
                        to={routers['userInfo']}
                        selected={routers['userInfo'] == pathname}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isOpenSidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Informações do usuário'} sx={{ opacity: isOpenSidebar ? 1 : 0 }} />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Alterar senha">
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isOpenSidebar ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={RouterLink}
                        to={routers['userPassword']}
                        selected={routers['userPassword'] == pathname}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isOpenSidebar ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <LockIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Alterar senha'} sx={{ opacity: isOpenSidebar ? 1 : 0 }} />
                    </ListItemButton>
                </Tooltip>
            </List>
            <Divider />
            <List>
                {
                    isAdmin() && getAdminItems()
                }
            </List>
        </Drawer>
    );
}