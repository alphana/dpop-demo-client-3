import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import Callback from './components/Callback';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme();

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Container component="main" maxWidth="md">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<Callback />} />
              <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
              />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
  );
}

export default App;