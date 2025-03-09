// Path: features\auth\components\AuthStatus.tsx
import { useMemo } from 'react';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  useAuthStore,
  selectIsAuthenticated,
  selectIsAdmin,
  selectUsername,
} from '@/stores/authStore';

interface AuthStatusProps {
  showRole?: boolean;
  vertical?: boolean;
  showUsername?: boolean;
}

const StatusContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'vertical',
})<{ vertical: boolean }>(({ theme, vertical }) => ({
  display: 'flex',
  flexDirection: vertical ? 'column' : 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * Component to display current authentication status
 * Shows username and role depending on props
 */
export const AuthStatus = ({
  showRole = true,
  vertical = false,
  showUsername = true,
}: AuthStatusProps) => {
  const theme = useTheme();

  // Use selectors for better performance
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const username = useAuthStore(selectUsername);

  const roleColor = useMemo(() => {
    if (!isAuthenticated) return 'default';
    return isAdmin ? 'primary' : 'success';
  }, [isAuthenticated, isAdmin]);

  const roleName = useMemo(() => {
    if (!isAuthenticated) return 'Não autenticado';
    return isAdmin ? 'Administrador' : 'Usuário';
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) {
    return (
      <StatusContainer vertical={vertical}>
        <Chip label="Não autenticado" color="error" size="small" />
      </StatusContainer>
    );
  }

  return (
    <StatusContainer vertical={vertical}>
      {showUsername && username && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {username}
        </Typography>
      )}

      {showRole && (
        <Chip
          label={roleName}
          color={roleColor}
          size="small"
          sx={{
            height: 20,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      )}
    </StatusContainer>
  );
};
