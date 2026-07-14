import { usePoints } from '@/features/customer/cart-with-checkout/hooks'
import React from 'react'

const AdminDashboard = () => {
  const { data: points } = usePoints();

  console.log(points); // number | undefined
  
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard