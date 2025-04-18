import axios from 'axios'
import globalRouter from '../app/globalRouter'

// Create an Axios instance
// Ideally base url would be an environment variable but for simplicity to run locally is hardcoded
const axiosInstance = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
})

// Add interceptor to refresh access token when it expires after 1 hour
axiosInstance.interceptors.response.use(
  response => response, // Directly return successful responses.
  async error => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry && globalRouter.navigate) {
      console.log('Authorization token expired, attempting to acquire new token.')
      originalRequest._retry = true // Mark the request as retried to avoid infinite loops.
      try {
        const userInfo = localStorage.getItem('userInfo') // Retrieve user info
        ? JSON.parse(localStorage.getItem('userInfo') as string)
        : null 
        
        // Refresh token if user info is found in local storage, otherwise navigate to login page
        if(userInfo) {
          await axiosInstance.post('/auth/login', {name: userInfo['name'], email: userInfo['email']})
          return await axiosInstance(originalRequest) // Retry the original request with the new access token.
        }
        else {
          console.error('Token refresh failed:', 'User info not found')
          localStorage.removeItem('userInfo')
          globalRouter.navigate('/login')
        }
        
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored user info and redirecting to the login page.
        console.error('Token refresh failed:', refreshError)
        localStorage.removeItem('userInfo')
        globalRouter.navigate('/login')
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error) // For all other errors, return the error as is.
  }
)

export default axiosInstance