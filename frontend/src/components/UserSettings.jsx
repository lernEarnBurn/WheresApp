import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

import { Loader2 } from 'lucide-react'
import { ArrowLeft } from 'lucide-react';

import Buffer from 'buffer'

UserSettings.propTypes = {
  removeDisplaySettings: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profilePic: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.shape({
        data: PropTypes.instanceOf(Buffer).isRequired,
        contentType: PropTypes.string.isRequired,
      }),
    }),
  }),
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

  //weird async behavior is making me do this
  async function saveChanges() {
    
    if (username !== props.user.username && description !== props.user.description) {
      setLoading(true)
      await editUsername(props.user, username)
      await editDescription(props.user, description)

    } else if (username !== props.user.username && description === props.user.description) {
      setLoading(true)
      await editUsername(props.user, username)

    }else if(description !== props.user.description && username === props.user.username){
      setLoading(true)
      await editDescription(props.user, description)
    }

    setLoading(false)
  }

  return (
    <motion.section initial={{ x: -700 }} animate={{ x: 0 }} exit={{ x: -700 }} transition={{ duration: .3 }} className='w-full h-full flex flex-col overflow-hidden'>
      <div className="bg-color w-full h-[18%] flex gap-6">
        <ArrowLeft onClick={props.removeDisplaySettings} className='text-white mt-[5.3rem] ml-5'/>
        <h1 className='text-white text-2xl mt-20 ml-5'>Profile</h1>
      </div>
      <div className="w-full h-[82%] flex flex-col items-center">
        {props.user.profilePic ? (
          <div className="my-1 w-56 h-56 rounded-full overflow-hidden flex-shrink-0">
            {/* The original code to display profilePic might need adjustment based on how profilePic is structured */}
            <img
              src={props.user.profilePic}
              alt={`${props.user.username}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="my-1 w-56 h-56 default-pic flex-shrink-0"></div>
        )}
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