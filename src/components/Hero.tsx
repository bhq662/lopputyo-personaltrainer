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
                py: { xs: 10, sm: 15 }, // small/medium padding
                minHeight: '100vh', // make Hero at least full viewport height
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
                    {/* Heading in one row */}
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
                    {/* Opens customer dialog */}
                    <AddCustomer fetchCustomers={() => { }} redirectTo="/customers" />

                    {/* Training dialog */}
                    <AddTraining fetchTrainings={() => { }} redirectTo="/trainings" />

                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/statistics"
                    >
                        View Statistics
                    </Button>                </Stack>

            </Container>
        </Box >
    )
}