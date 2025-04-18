import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux-hooks'
import { Navigate } from 'react-router-dom'

// Protected Layout that should only be accessible after receiving authorization token
const ProtectedLayout = () => {
  const userProfileInfo = useAppSelector((state) => state.auth.userBasicInfo)

  if (!userProfileInfo) {
    return <Navigate replace to={'/fetch-take-home/login'} />
  }

  return (
    <>
      <Outlet />
    </>
  )
}

export default ProtectedLayout