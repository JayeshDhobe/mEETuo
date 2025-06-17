import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, Card, CardContent, Typography, TextField, Button, Avatar, Tabs, Tab, Alert, Fade, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const API = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (isLogin) {
        res = await axios.post(`${API}/api/auth/login`, { email: form.email, password: form.password });
      } else {
        res = await axios.post(`${API}/api/auth/signup`, form);
      }
      login(res.data.token);
      navigate('/schedule');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  const handleGuest = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/guest`, { name: form.name || 'Guest' });
      login(res.data.token);
      navigate('/schedule');
    } catch (err) {
      setError('Guest login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Fade in timeout={800}>
        <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.65)', p: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, mb: 2, boxShadow: 3 }}>
              {isLogin ? <LoginIcon fontSize="large" /> : <HowToRegIcon fontSize="large" />}
            </Avatar>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
              {isLogin ? 'Sign in to mEETuo' : 'Create your account'}
            </Typography>
            <Tabs value={isLogin ? 0 : 1} onChange={(_, v) => setIsLogin(v === 0)} centered sx={{ mb: 2, minHeight: 36, '& .MuiTab-root': { color: 'text.secondary', fontWeight: 600, fontSize: 16 }, '& .Mui-selected': { color: 'primary.main' } }}>
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              {!isLogin && (
                <TextField
                  name="name"
                  label="Name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  autoComplete="off"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
                  sx={{ input: { color: 'text.primary' }, mb: 1 }}
                />
              )}
              <TextField
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                autoComplete="off"
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
                sx={{ input: { color: 'text.primary' }, mb: 1 }}
              />
              <TextField
                name="password"
                type="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                autoComplete="off"
                InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }}
                sx={{ input: { color: 'text.primary' }, mb: 1 }}
              />
              {error && <Alert severity="error" sx={{ mt: 1, mb: 1, borderRadius: 2 }}>{error}</Alert>}
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, mb: 1, borderRadius: 3, fontWeight: 700, fontSize: 16, boxShadow: 2 }} startIcon={isLogin ? <LoginIcon /> : <HowToRegIcon />}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
              <Button onClick={handleGuest} variant="outlined" color="secondary" fullWidth size="large" sx={{ mb: 1, borderRadius: 3, fontWeight: 600, fontSize: 15, borderWidth: 2, boxShadow: 0 }} startIcon={<GroupAddIcon />}>
                Join as Guest
              </Button>
            </form>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
