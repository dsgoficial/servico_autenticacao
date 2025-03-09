// Path: components\layouts\AppLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import AppSidebar from './AppSidebar';
import AppNavbar from './AppNavbar';

// Constants
const APP_BAR_HEIGHT = 64;
const DRAWER_WIDTH = 280;

// Styled components
const RootStyle = styled(Box)({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_HEIGHT + 24,
  paddingBottom: theme.spacing(10),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    paddingTop: APP_BAR_HEIGHT + 16,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(6),
  },
}));

const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Simple toggle function for the drawer
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <RootStyle>
      <AppNavbar onDrawerToggle={handleDrawerToggle} />

      <AppSidebar
        open={drawerOpen}
        onClose={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
      />

      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
};

export default AppLayout;