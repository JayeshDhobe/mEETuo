import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPagex';
import MeetingPage from './pages/MeetingPage';
import LobbyPage from './pages/LobbyPage';
import SchedulerPage from './pages/SchedulerPage';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/meeting/:roomId" element={<MeetingPage />} />
            <Route path="/lobby/:roomId" element={<LobbyPage />} />
            <Route path="/schedule" element={<SchedulerPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
