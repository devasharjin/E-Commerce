import {Outlet} from 'react-router-dom'
import { CustomerNavbar } from '../customer/common/desktop_navbar'

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-background">
        <CustomerNavbar/>
        <main>
            <Outlet/>
        </main>

    </div>
  )
}

export default CustomerLayout