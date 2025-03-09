// Path: components\ui\Loading.tsx
import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  fullScreen?: boolean;
}

const LoadingContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'fullScreen',
})<{ fullScreen: boolean }>(({ theme, fullScreen }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  height: fullScreen ? '100vh' : 'auto',
  width: '100%',
}));

/**
 * Loading component to display loading state
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
}) => {
  // Map size names to actual pixel values
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  return (
    <LoadingContainer fullScreen={fullScreen}>
      <CircularProgress color={color} size={sizeMap[size]} />
    </LoadingContainer>
  );
};

export default Loading;
