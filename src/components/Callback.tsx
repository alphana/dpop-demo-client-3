import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { CircularProgress, Box } from '@mui/material';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const user = await authService.handleCallback();
                console.log('Successfully logged in:', user);
                navigate('/');
            } catch (error) {
                console.error('Callback handling failed:', error);
                setTimeout(() => navigate('/login'), 100);
            }
        };

        handleCallback();
    }, [navigate]);


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );
};

export default Callback;