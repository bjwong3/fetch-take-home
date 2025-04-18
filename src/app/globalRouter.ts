import { NavigateFunction } from 'react-router-dom'

// Used for routing inside Axios interceptor
const globalRouter = { navigate: null } as {
  navigate: null | NavigateFunction
}

export default globalRouter