import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConvColumn } from './ConvColumn'
import { ConvInterface } from './ConvInterface'

import { UserSettings } from './UserSettings'

import { AnimatePresence, motion } from 'framer-motion'


export function Menu(){
  const navigate = useNavigate()
  
  const [user] = useState(JSON.parse(localStorage.getItem('user')))
  const [showUserSettings, setShowUserSettings] = useState(false)

  const displaySettings = () => {setShowUserSettings(true)}
  const removeDisplaySettings = () => {setShowUserSettings(false)}

  function logOut(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('conversations')
    navigate('/WheresApp/Login')
  }

  return (
      <div className="overflow-hidden logo-bg h-[100vh] w-[100vw] grid place-items-center">
        <section className='overflow-hidden w-[97vw] h-[95vh] bg-white flex '>
          
          
          
          <div className='relative  w-[30%] h-full'>
          <AnimatePresence>
            {showUserSettings ? (
              <UserSettings key="userSettings" removeDisplaySettings={removeDisplaySettings}/>
            ) : (
              <motion.div key="convColumn" exit={{}} className='w-full h-full'>
                <ConvColumn logOutFunc={logOut} user={user} displaySettings={displaySettings}/>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          <ConvInterface />
        </section>
      </div>
  )
}