import { useState } from 'react'
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material'
import { useAppDispatch } from '../../hooks/redux-hooks'
import { login } from '../../slices/authSlice'
import { useNavigate } from 'react-router-dom'
import '../../styles/LoginStyle.css'

// Login Page
const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError(null)

    // Return error if name or email field isn't filled in
    if (!name || !email) {
      setError('Please enter both name and email.')
      return
    }

    // Attempt login POST request
    setLoading(true)
    try {
      await dispatch(login({ name, email })).unwrap()
      navigate('/fetch-take-home/home')
    } catch (e: any) {
      setError(e?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Login container */}
      <div className='text-container'>
      <Container maxWidth='xs'>
        <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant='h2' sx={{ mb: 10 }}>Adopt-A-Dog</Typography>

            <Box sx={{ my: 1, width: '100%' }}>
              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                margin='normal'
                required
                fullWidth
                id='name'
                name='name'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                fullWidth
                variant='contained'
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color='inherit' /> : 'Login'}
              </Button>
            </Box>
          </Box>
      </Container>
      
      {/* Background styling */}
      </div>
      <div className='gradient-bg'>
        <svg xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <filter id='goo'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='10' result='blur' />
              <feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8' result='goo' />
              <feBlend in='SourceGraphic' in2='goo' />
            </filter>
          </defs>
        </svg>
        <div className='gradients-container'>
          <div className='g1'></div>
          <div className='g2'></div>
          <div className='g3'></div>
          <div className='g4'></div>
          <div className='g5'></div>
        </div>
      </div>
    </>
  )
}

export default Login
