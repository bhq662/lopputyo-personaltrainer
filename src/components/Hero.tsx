// MUI imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

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
                            textAlign: 'center',
                            fontSize: '1.25em',
                            color: 'text.secondary',
                            width: { sm: '100%', md: '80%' },
                        }}
                    >
                        Manage your customers and their trainings. All in one place.
                    </Typography>
                </Stack>

                {/* Placeholder Box instead of image
                <Box
                    sx={{
                        mt: 6,
                        width: '100%',
                        maxWidth: 800,
                        height: 400,
                        borderRadius: 2,
                        backgroundColor: 'white',
                        boxShadow: 3,
                    }}
                /> */}
            </Container>
        </Box>
    )
}