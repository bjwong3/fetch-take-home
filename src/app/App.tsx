import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './routes/Home'
import Login from './routes/Login'
import Favorites from './routes/Favorites'
import './App.css'
import DefaultLayout from './layouts/DefaultLayout'
import ProtectedLayout from './layouts/ProtectedLayout'
import globalRouter from './globalRouter'
import { teal } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material/styles'

function App() {
  const navigate = useNavigate()
  globalRouter.navigate = navigate

  const darkTheme = createTheme({
    palette: {
      secondary: teal,
      mode: 'dark',
      text: {
        primary: '#ffffff',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#ffffff',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#ffffff',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ffffff',
            },
          },
        },
      },
    },
  })

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path='/' element={<Home />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path='/favorites' element={<Favorites />} />
          </Route>
          <Route element={<DefaultLayout />}>
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
