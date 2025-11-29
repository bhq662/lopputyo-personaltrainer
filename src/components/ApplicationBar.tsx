import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUI imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function ApplicationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Customers', path: '/customers' },
    { label: 'Trainings', path: '/trainings' },
    { label: 'Statistics', path: '/statistics' }
  ];

  const toggleDrawer = (open: boolean) => () => setMobileOpen(open);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'hsl(210, 100%, 95%)',
          color: 'text.primary',
          boxShadow: '0px 4px 6px rgba(118, 150, 199, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 700,
                '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
              }}
            >
              Personal Training
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton onClick={toggleDrawer(true)} color="inherit"
                sx={{
                  '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
                }}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="top"
                open={mobileOpen}
                onClose={toggleDrawer(false)}
                slotProps={{
                  paper: {
                    sx: {
                      pb: 2,
                      backgroundColor: 'hsl(220, 100%, 95%)',
                    },
                  },
                }}
              >
                <Box sx={{ px: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <IconButton onClick={toggleDrawer(false)}
                      sx={{
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  {navItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      component={RouterLink}
                      to={item.path}
                      onClick={toggleDrawer(false)}
                      sx={{
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'transparent',
                        }
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar >
    </>
  );
}
