import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConvColumn } from './ConvColumn'
import { ConvInterface } from './ConvInterface'

export function Menu(){
  const navigate = useNavigate()
  
  const [user] = useState(localStorage.getItem('user'))


  function logOut(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/WheresApp/Login')
  }

  return (
      <div className="logo-bg h-[100vh] w-[100vw] grid place-items-center">
        <section className='w-[97vw] h-[95vh] bg-white flex'>
          <ConvColumn/>
          <ConvInterface/>
        </section>
      </div>
  )
}