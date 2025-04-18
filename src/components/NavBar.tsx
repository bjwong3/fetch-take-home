import { 
  AppBar,
  Toolbar,
  Button,
  Typography
} from '@mui/material'
import { useAppDispatch } from '../hooks/redux-hooks'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../slices/authSlice'

// Navigation Bar
const NavBar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  // Attempt logout POST request and direct to login page
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      navigate('/fetch-take-home/login')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <AppBar 
        sx={{ 
          backgroundColor: '#424242',
          borderBottom: '1px solid #888',
          height: 56,
          justifyContent: 'center',
          boxShadow: 'none',
          width: '100%',
          top: 0,
          zIndex: theme => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ minHeight: '0 !important', px: 2 }}>
          {/* Title */}
          <Typography 
            variant='h6' 
            sx={{ 
              color: '#f5f5f5', 
              fontWeight: 500, 
              fontSize: '1.25rem',
              mr: 'auto'
            }}
          >
            Adopt-A-Dog
          </Typography>
          {/* Home Route */}
          <Button 
            onClick={() => navigate('/fetch-take-home/home')} 
            color={isActive('/fetch-take-home/home') ? 'secondary' : 'inherit'} 
            variant={isActive('/fetch-take-home/home') ? 'contained' : 'text'} 
            size='small'
            sx={{ mx: 2 }}
          >
            Home
          </Button>
          {/* Favorites Route */}
          <Button 
            onClick={() => navigate('/fetch-take-home/favorites')} 
            color={isActive('/fetch-take-home/favorites') ? 'secondary' : 'inherit'} 
            variant={isActive('/fetch-take-home/favorites') ? 'contained' : 'text'} 
            size='small'
            sx={{ mr: 2 }}
          >
            Favorites
          </Button>
          {/* Logout Button */}
          <Button 
            variant='contained' 
            color='primary' 
            size='small' 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>  
    </>
  )
}

export default NavBar