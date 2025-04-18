import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../types/User'
import { AuthApiState } from '../types/AuthApiState'
import axiosInstance from '../api/axiosInstance'

const initialState: AuthApiState = {
  userBasicInfo: localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo') as string)
  : null,
  status: 'idle',
  error: null,
}

export const login = createAsyncThunk('login', async (data: User) => {
  // Send POST request to login endpoint
  const response = await axiosInstance.post('/auth/login', data)
  const resStatus = response.status

  if(resStatus === 200) console.log('POST login HTTP request was successful')

  const userData: User = {
    name: data['name'], 
    email: data['email']
  }

  // Add user data to local storage
  localStorage.setItem('userInfo', JSON.stringify(userData))
  localStorage.setItem('favorited', JSON.stringify([]))

  return userData
})

export const logout = createAsyncThunk('logout', async () => {
  // Send POST request to logout endpoint to invalidate token
  const response = await axiosInstance.post('/auth/logout')
  const resData = response.data

  // Remove user data from local storage
  localStorage.removeItem('userInfo')
  localStorage.removeItem('favorited')

  return resData
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = 'idle'
          state.userBasicInfo = action.payload
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Login failed'
      })

      .addCase(logout.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle'
        state.userBasicInfo = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Logout failed'
      })
  },
})

export default authSlice.reducer