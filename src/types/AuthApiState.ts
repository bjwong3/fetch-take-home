import { User } from './User'

// API initial state for authSlice
type AuthApiState = {
    userBasicInfo?: User | null
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

export { type AuthApiState }