import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
            dark: '#115293',
            light: '#4791db',
            contrastText: '#fff',
        },
        secondary: {
            main: '#ff4081',
            dark: '#c60055',
            light: '#ff79b0',
            contrastText: '#fff',
        },
        background: {
            default: '#181a20',
            paper: '#23262f',
        },
        divider: 'rgba(255,255,255,0.08)',
        text: {
            primary: '#fff',
            secondary: '#b0b3b8',
        },
    },
    shape: {
        borderRadius: 6, // Reduced for a sharper look
    },
    typography: {
        fontFamily: 'Poppins, Roboto, Arial',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        allVariants: { color: '#fff' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 6, // match global
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#23262f',
                    borderRadius: 6, // match global
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#23262f',
                    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.45)',
                    borderRadius: 6, // match global
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: '#23262f',
                    color: '#fff',
                    borderRadius: 6, // match global
                },
                input: {
                    color: '#fff',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    borderRadius: 6, // match global
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: 6, // match global
                },
            },
        },
        MuiModal: {
            styleOverrides: {
                root: {
                    borderRadius: 6, // match global
                },
            },
        },
    },
});

export default theme;
