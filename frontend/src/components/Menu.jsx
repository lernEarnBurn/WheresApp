import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'

import { ConvProvider } from '../contexts/ConvContext'

import { ConvColumn } from './ConvColumn'
import { ConvInterface } from './ConvInterface'
import { UserSettings } from './UserSettings'




export function Menu(){
  const navigate = useNavigate()
  
  const [user] = useState(JSON.parse(localStorage.getItem('user')))
  const [showUserSettings, setShowUserSettings] = useState(false)
  const { profilePic, setProfilePic } = useGetProfilePic(user)


  const displaySettings = () => {setShowUserSettings(true)}
  const removeDisplaySettings = () => {setShowUserSettings(false)}

  function logOut(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('conversations')
    localStorage.removeItem('profilePicUrl')
    navigate('/WheresApp/Login')
  }

  return (
      <div className="overflow-hidden logo-bg h-[100vh] w-[100vw] grid place-items-center">
        <ConvProvider>
          <section className='w-[97vw] h-[95vh] bg-white flex '>
            <div className='relative  w-[30%] h-full'>
            <AnimatePresence>
              {showUserSettings ? (
                <UserSettings setProfilePic={setProfilePic} profilePic={profilePic} user={user} key="userSettings" removeDisplaySettings={removeDisplaySettings}/>
              ) : (
                <motion.div key="convColumn" exit={{}} className='w-full h-full'>
                  <ConvColumn profilePic={profilePic} logOutFunc={logOut} user={user} displaySettings={displaySettings}/>
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            <ConvInterface user={user} />
          </section>
        </ConvProvider>
      </div>
  )
}


function useGetProfilePic(user){
  const [profilePic, setProfilePic] = useState(() => {
  
    const savedPic = localStorage.getItem('profilePicUrl');
    return savedPic || null; 
  });

  useEffect(() => {
    if(!profilePic) { 
      const getPic = async() => {
        const response = await axios.get(`http://localhost:3000/user/${user._id}/profilePic/${user.profilePic}`, {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data) {
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          setProfilePic(imageUrl);
          localStorage.setItem('profilePicUrl', imageUrl); 
        }
      };

      if(user.profilePic){
        getPic();
      }
    }
  }, [user, profilePic]); 

  return { profilePic, setProfilePic };
}
