import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux-hooks'
import { Navigate } from 'react-router-dom'

// Default Layout
const DefaultLayout = () => {
  const userProfileInfo = useAppSelector((state) => state.auth.userBasicInfo)

  if (userProfileInfo) {
    return <Navigate replace to={'/home'} />
  }

  return (
    <>
      <Outlet />
    </>
  )
}

export default DefaultLayout