import { Outlet } from "react-router-dom"
import { useBootstrapAuth } from "./usBootstrapAuth"


const AuthProvider = () => {
    useBootstrapAuth()
  return <Outlet/>

}

export default AuthProvider