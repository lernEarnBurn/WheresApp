import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import axios from 'axios';

import { Loader2 } from 'lucide-react'
import { ArrowLeft } from 'lucide-react';


UserSettings.propTypes = {
  removeDisplaySettings: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profilePic: PropTypes.string.isRequired,
  }),
  profilePic: PropTypes.string.isRequired,
  setProfilePic: PropTypes.func.isRequired,

};


export function UserSettings(props) {
  const [username, setUsername] = useState(props.user.username);
  const [description, setDescription] = useState(props.user.description);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const [loading, setLoading] = useState(false)


  async function saveChanges() {
    setLoading(true);
  
    if (username !== props.user.username) {
      await editUsername(props.user, username);
    }
    if (description !== props.user.description) {
      await editDescription(props.user, description);
    }
    if (selectedFile) {
      await uploadProfilePic(props.setProfilePic, props.user, selectedFile); 
      setSelectedFile(null);
    }
  
    setLoading(false);
  }

  const fileInputRef = useRef(null) 
  const [profilePicUrl, setProfilePicUrl] = useState(props.profilePic ? props.profilePic : 'public/images/stockAvatar.png');
  const [selectedFile, setSelectedFile] = useState(null)

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  }

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    setProfilePicUrl(url);
    setSelectedFile(file)
    
  };

  return (
    <motion.section initial={{ x: -700 }} animate={{ x: 0 }} exit={{ x: -700 }} transition={{ duration: .3 }} className='w-full h-full flex flex-col overflow-hidden'>
      <div className="bg-color w-full h-[18%] flex gap-6">
        <ArrowLeft onClick={props.removeDisplaySettings} className='text-white mt-[5.3rem] ml-5'/>
        <h1 className='text-white text-2xl mt-20 ml-5'>Profile</h1>
      </div>
      <div className="w-full h-[82%] flex flex-col items-center">

      <div className="my-4 w-[12.5rem] h-[12.5rem] rounded-full overflow-hidden flex-shrink-0 cursor-pointer" onClick={handleProfilePicClick}>
        <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover"></img>
      </div>

        <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} style={{ display: 'none' }} />
        <div className='w-full h-[6.5rem] user-input-bg mb-8'>
          <h2 className='py-2 px-7 fg-color text-lg font-medium'>Username</h2>
          <input spellCheck="false" value={username} onChange={handleUsernameChange} className='user-input-bg fg-color text-md w-[25.75vw] ml-6' type="text" />
        </div>
        <div className='w-full h-[6.5rem] user-input-bg'>
          <h2 className='py-2 px-7 fg-color text-lg font-medium'>Description</h2>
          <input value={description} onChange={handleDescriptionChange} className='user-input-bg fg-color text-md w-[25.75vw] ml-6' type="text" />
        </div>
        {!loading ? (
          <motion.button
            onClick={saveChanges}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="rest"
            initial="rest"
            className='mt-5 px-5 h-11 text-md'
          >
            Save Changes
          </motion.button>
        ) : (
          <button disabled className="w-[11vw] mt-5 px-5 h-11 text-md grid place-items-center">
            <Loader2 className="animate-spin" />
          </button>
)}
      </div>
    </motion.section>
  );
}


function locallyEditUsername(user, username){
  user.username = username
  localStorage.setItem('user', JSON.stringify(user))
}

async function editUsername(user, username){
  try {
    const response = await axios.post(
      `http://localhost:3000/user/${user._id}/username`,
      { newUsername: username },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    ).then(() => {
      locallyEditUsername(user, username)
    })
    console.log(response); 
  } catch (err) {
    console.log(err);
  }
}


function locallyEditDescription(user, description){
  user.description = description
  localStorage.setItem('user', JSON.stringify(user))
}


async function editDescription(user, description){
  try {
    const response = await axios.post(
      `http://localhost:3000/user/${user._id}/description`,
      { newDescription: description },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    ).then(() => {
      locallyEditDescription(user, description)
    })
    console.log(response); 
  } catch (err) {
    console.log(err);
  }
}

function locallyEditProfilePic(user, image){  
  if(image) {
    const updatedUser = { ...user, profilePic: image._id };
    localStorage.setItem('user', JSON.stringify(updatedUser)); 
  }

}


async function uploadProfilePic(setProfilePic, user, image){
  try {
    
    const formData = new FormData();
    formData.append('image', image);

    const token = localStorage.getItem('token');

    const response = await axios.post(
      `http://localhost:3000/user/${user._id}/profilePic`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      }).then((response) => {
      locallyEditProfilePic( user, response.data)
      if(response.data){
        const picUrl = URL.createObjectURL(image)
        setProfilePic(picUrl)
        localStorage.setItem('profilePicUrl', picUrl); 
  
      }
    })

    

  } catch (err) {
    console.error(err);
  }
}