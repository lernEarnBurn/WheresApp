import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export function Menu(){
  const navigate = useNavigate()
  
  const [user] = useState(localStorage.getItem('user'))


  function logOut(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/WheresApp/Login')
  }

  return (
    <>
      <p>{user}</p>
      <button onClick={logOut}>Logout</button>
    </>

  )
}