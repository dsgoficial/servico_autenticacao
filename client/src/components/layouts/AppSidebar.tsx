// Path: components\layouts\AppSidebar.tsx
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  Typography,
  List,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import { useAuthStore } from '@/stores/authStore';

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const AppSidebar = ({ open, onClose, drawerWidth }: AppSidebarProps) => {
  const { pathname } = useLocation();
  const isAdmin = useAuthStore(state => state.isAdmin);
  const theme = useTheme();

  // Define menu items routing paths
  const routes = {
    userInfo: '/',
    userPassword: '/alterar_senha',
    manageUsers: '/gerenciar_usuarios',
    dashboard: '/dashboard',
    authUser: '/autorizar_usuarios',
    manageApplications: '/gerenciar_aplicacoes',
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      // Modal drawer for all screen sizes
      variant="temporary"
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
        }}
      >
        <Typography variant="h6" sx={{ ml: 2 }}>
          Menu
        </Typography>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />
      
      <List>
        <ListItemButton
          component={RouterLink}
          to={routes.userInfo}
          selected={routes.userInfo === pathname}
          onClick={onClose}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Informações do usuário" />
        </ListItemButton>

        <ListItemButton
          component={RouterLink}
          to={routes.userPassword}
          selected={routes.userPassword === pathname}
          onClick={onClose}
        >
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Alterar senha" />
        </ListItemButton>
      </List>

      {isAdmin && (
        <>
          <Divider />
          <List>
            <ListItemButton
              component={RouterLink}
              to={routes.dashboard}
              selected={routes.dashboard === pathname}
              onClick={onClose}
            >
              <ListItemIcon>
                <InsertChartIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton
              component={RouterLink}
              to={routes.manageUsers}
              selected={routes.manageUsers === pathname}
              onClick={onClose}
            >
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Gerenciar usuários" />
            </ListItemButton>

            <ListItemButton
              component={RouterLink}
              to={routes.authUser}
              selected={routes.authUser === pathname}
              onClick={onClose}
            >
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary="Autorizar usuários" />
            </ListItemButton>

            <ListItemButton
              component={RouterLink}
              to={routes.manageApplications}
              selected={routes.manageApplications === pathname}
              onClick={onClose}
            >
              <ListItemIcon>
                <DesktopMacIcon />
              </ListItemIcon>
              <ListItemText primary="Gerenciar aplicações" />
            </ListItemButton>
          </List>
        </>
      )}
    </Drawer>
  );
};

export default AppSidebar;