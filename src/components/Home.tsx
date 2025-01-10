import React, {useState} from 'react';
import {TextField, Button, Box, Typography} from '@mui/material';
import {authService} from '../services/auth';
import {useNavigate} from 'react-router-dom';
import axios from 'axios'

export default function Home() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSubmit = async () => {
        try {

            let baseUrl = 'http://localhost:8080/api';


            const response = await authService.sendAuthenticatedRequest(
                'POST',
                `${baseUrl}/messages`,
                message
            );


            if (response.status) {
                setMessage('');
                alert('Message sent successfully!');
            } else {
                alert('Failed to send message');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <Box sx={{mt: 4}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Protected Area
            </Typography>
            <Box sx={{mt: 2}}>
                <TextField
                    fullWidth
                    label="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                />
                <Box sx={{mt: 2, display: 'flex', gap: 2}}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!message}
                    >
                        Send Message
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        color="secondary"
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}