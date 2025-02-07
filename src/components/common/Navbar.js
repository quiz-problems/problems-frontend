import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TopicIcon from '@mui/icons-material/Topic';
import QuizIcon from '@mui/icons-material/Quiz';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/');
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Topics', path: '/topics', icon: <TopicIcon /> },
    { text: 'Quizzes', path: '/quizzes', icon: <QuizIcon /> },
    { text: 'Leaderboard', path: '/leaderboard', icon: <LeaderboardIcon /> },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ text: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> });
  }

  const MotionMenuItem = motion(MenuItem);
  const MotionListItem = motion(ListItem);

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 0,
              textDecoration: 'none',
              color: 'inherit',
              mr: 4,
              display: { xs: 'none', sm: 'block' },
              fontWeight: 700,
              letterSpacing: '0.5px',
              background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.8))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CS Quiz App
          </Typography>
        </motion.div>

        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)',
                    },
                    ...(location.pathname === item.path && {
                      background: 'rgba(255,255,255,0.15)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }),
                  }}
                >
                  {item.text}
                </Button>
              </motion.div>
            ))}
          </Box>
        )}

        <Box sx={{ flexGrow: 0 }}>
          {user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  startIcon={
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: user.avatar?.color || 'primary.dark',
                        fontSize: '1rem',
                        border: '2px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {user.avatar?.initials || user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  sx={{
                    textTransform: 'none',
                    borderRadius: '12px',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {!isMobile && (
                    <Typography sx={{ ml: 1, fontWeight: 500 }}>
                      {user.name}
                    </Typography>
                  )}
                </Button>
              </motion.div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    borderRadius: '12px',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <AnimatePresence>
                  <MotionMenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleProfileMenuClose}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MotionMenuItem>
                  <MotionMenuItem
                    onClick={handleLogout}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MotionMenuItem>
                </AnimatePresence>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  startIcon={<HowToRegIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  Register
                </Button>
              </motion.div>
            </Box>
          )}
        </Box>
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.background.default})`,
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            CS Quiz App
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navItems.map((item, index) => (
              <MotionListItem
                key={item.text}
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={handleDrawerToggle}
                sx={{
                  mb: 1,
                  borderRadius: '12px',
                  color: 'inherit',
                  '&.Mui-selected': {
                    backgroundColor: `${theme.palette.primary.main}15`,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}25`,
                    }
                  },
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                />
              </MotionListItem>
            ))}
            {user ? (
              <>
                <MotionListItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleDrawerToggle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  sx={{ borderRadius: '12px' }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Profile"
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  />
                </MotionListItem>
                <MotionListItem
                  button
                  onClick={() => {
                    handleDrawerToggle();
                    handleLogout();
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
                  sx={{ borderRadius: '12px' }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Logout"
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  />
                </MotionListItem>
              </>
            ) : (
              <>
                <MotionListItem
                  component={RouterLink}
                  to="/login"
                  onClick={handleDrawerToggle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  sx={{ borderRadius: '12px' }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Login"
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  />
                </MotionListItem>
                <MotionListItem
                  component={RouterLink}
                  to="/register"
                  onClick={handleDrawerToggle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
                  sx={{ borderRadius: '12px' }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                    <HowToRegIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Register"
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  />
                </MotionListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar; 