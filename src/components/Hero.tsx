import { Link as RouterLink } from 'react-router-dom';
import AddCustomer from './AddCustomer';
import AddTraining from './AddTraining';

// MUI imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';


export default function App() {
    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                py: { xs: 10, sm: 15 },
                minHeight: '100vh'
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Stack
                    spacing={2}
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                >
                    {/* Split heading for accent color */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                            fontWeight: 700,
                            textAlign: 'center',
                        }}
                    >
                        Your{' '}
                        <Box component="span" sx={{ color: 'primary.main' }}>
                            Personal Training
                        </Box>{' '}
                        Tool
                    </Typography>

                    {/* Copywriting */}
                    <Typography
                        sx={{
                            mt: 4,
                            textAlign: 'center',
                            fontSize: '1.25em',
                            color: 'text.secondary',
                            width: { sm: '100%', md: '80%' },
                        }}
                    >
                        Manage your customers and their trainings. All in one place.
                    </Typography>
                </Stack>

                <Stack
                    sx={{
                        mt: 6,
                        width: '100%',
                        maxWidth: 180,
                        gap: 3,

                    }}
                >
                    {/* Opens new customer dialog, redirects to customer list after */}
                    <AddCustomer fetchCustomers={() => { }} redirectTo="/customers" />

                    {/* Opens new training dialog, redirects to training list after */}
                    <AddTraining fetchTrainings={() => { }} redirectTo="/trainings" />

                    {/* Opens statistics page */}
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/statistics"
                    >
                        Statistics
                    </Button>
                </Stack>
            </Container>
        </Box >
    )
}