// Path: lib\theme.ts
import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// COLORS
const PRIMARY = {
  lighter: '#D1E9FC',
  light: '#76B0F1',
  main: '#2065D1',
  dark: '#103996',
  darker: '#061B64',
};

const SECONDARY = {
  lighter: '#ffd4d4',
  light: '#ffb0b0',
  main: '#F50057',
  dark: '#c70046',
  darker: '#960035',
};

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
};

// Base theme options
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
};

// Create light theme
const lightThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY.main,
      light: PRIMARY.light,
      dark: PRIMARY.dark,
    },
    secondary: {
      main: SECONDARY.main,
      light: SECONDARY.light,
      dark: SECONDARY.dark,
    },
    error: ERROR,
    warning: WARNING,
    info: INFO,
    success: SUCCESS,
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: GREY[800],
      secondary: GREY[600],
    },
    grey: GREY,
    divider: GREY[500_24],
  },
};

// Create dark theme
const darkThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY.light,
      light: PRIMARY.lighter,
      dark: PRIMARY.main,
    },
    secondary: {
      main: SECONDARY.light,
      light: SECONDARY.lighter,
      dark: SECONDARY.main,
    },
    error: {
      ...ERROR,
      main: ERROR.light,
    },
    warning: {
      ...WARNING,
      main: WARNING.light,
    },
    info: {
      ...INFO,
      main: INFO.light,
    },
    success: {
      ...SUCCESS,
      main: SUCCESS.light,
    },
    background: {
      default: '#161C24',
      paper: '#212B36',
    },
    text: {
      primary: '#FFFFFF',
      secondary: GREY[500],
    },
    grey: GREY,
    divider: GREY[500_24],
  },
};

// Create themes using the options
export const lightTheme: Theme = createTheme(lightThemeOptions);
export const darkTheme: Theme = createTheme(darkThemeOptions);
