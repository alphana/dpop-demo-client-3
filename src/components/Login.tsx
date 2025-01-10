import React, { useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const user = await authService.getUser();
            if (user) {
                navigate('/home');
            }
        };
        checkUser();
    }, [navigate]);

    const handleLogin = async () => {
        try {
            await authService.login();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Welcome to DPoP Demo
            </Typography>
            <Button
                onClick={handleLogin}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Login with Keycloak
            </Button>
        </Box>
    );
}