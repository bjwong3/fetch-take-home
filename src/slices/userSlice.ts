import { createSlice } from '@reduxjs/toolkit'
import { UserProfileData } from '../types/User'

const initialState: UserProfileData = {
  name: localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo') as string).name
  : '',
  email: localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo') as string).email
  : '',
  favorited: localStorage.getItem('favorited')
  ? JSON.parse(localStorage.getItem('favorited') as string)
  : []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFavorited: (state, param) => {
      state.favorited = param.payload
      localStorage.setItem('favorited', JSON.stringify(state.favorited))
    }
  }
})

const { actions, reducer } = userSlice
export const { updateFavorited } = actions
export default reducer