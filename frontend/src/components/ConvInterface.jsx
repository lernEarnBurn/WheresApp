import { SendHorizontal } from 'lucide-react';
import { Image } from 'lucide-react';
import { SmilePlus } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

import { motion } from 'framer-motion'
import { useContext, useRef, useState } from 'react';
import axios from 'axios'

import PropTypes from 'prop-types'

import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { ConvContext } from '../contexts/ConvContext';


ConvInterface.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profilePic: PropTypes.string
  }),
}

export function ConvInterface(props){
  const { recipient, messages, status, setStatus, convId } = useContext(ConvContext)

  const fileInputRef = useRef(null) 
  const [picToSendSelected, setPicToSendSelected] = useState(false)
  const [profilePicUrl, setProfilePicUrl] = useState(null)

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  }


  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    const maxSize = 1 * 1024 * 1024
    
    if (!file || file.size > maxSize) {
      console.log('file is too large.')
      return;
    }

    const url = URL.createObjectURL(file);
   
    setProfilePicUrl(url);
    setPicToSendSelected(true)
    
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1},
  };

  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  //make a new message appear smoothly with animation as well as loading for send button
  async function sendMessageText() {
    try {
        let conversationId = convId; 

        if (status !== 'exist') {
            const newConversationResponse = await axios.post(`http://localhost:3000/user/${props.user._id}/conversations`, {
                recipient: recipient._id,
                lastMessage: inputValue,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            conversationId = newConversationResponse.data._id;

            updateLocalStorageWithNewConversation(newConversationResponse.data);
            setStatus('exist'); 
        }

        const messageResponse = await sendMessageToConversation(conversationId, inputValue, props);

        updateUIAndLocalStorageWithNewMessage(conversationId, messageResponse.data.message, messages);

        setInputValue('');
    } catch (err) {
        console.log(err);
    }
  }

  

      
  return (
    <>
    <section className='w-[70%] h-full'>
      
      <div className="w-full h-[9%] flex gap-3 items-center border-x border-gray-300">
        {recipient.profilePic ? (
          <div className="ml-5 mr-[.315rem] w-[3.2rem] h-[3.2rem] rounded-full overflow-hidden flex-shrink-0">
            <img
                src={recipient.profilePic}
                alt={`${recipient.username}'s profile`}
                className="w-full h-full object-cover"
              />
          </div>

        ) : (
          <div className="ml-5 w-14 h-14 default-pic flex-shrink-0"></div>
        )}
        <div className='flex flex-col mb-1  overflow-hidden max-w-[23vw]'>
          <h1 className='text-lg truncate font-semibold'>{recipient.username}</h1>
          <h2 className='text-xs truncate'>{recipient.description}</h2>
        </div>
        <MoreVertical className={`relative ${!picToSendSelected ? 'left-[58vw]' : 'left-[27.5vw]'}`}/>
      </div>


      <div className="w-full h-[81%] flex flex-col gap-5 user-input-bg border border-b-0 py-10 px-16 border-gray-300 overflow-y-scroll">
        {messages.map((message, index) => {
          const isReceived = message.sender === recipient._id;

          let messageContent;
          if (message.content.type === 'text') {
            messageContent = <div>{message.content.text}</div>;
          } else if (message.content.type === 'image') {
            messageContent = <div><img src={message.content.image} alt=""/></div>;
          } else {
            messageContent = <div>Unsupported content type</div>;
          }
        
          return (
            <div key={index} className={`message ${isReceived ? 'received' : ''}`}>
              {messageContent}
            </div>
          );
        })}
      </div>


      <div className="w-full h-[10%] flex items-center gap-4 border border-l-0 border-gray-300">
        <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} style={{ display: 'none' }} />
        <motion.button variants={buttonVariants} onClick={handleProfilePicClick} whileHover="hover" whileTap="rest"  initial="rest" className='ml-4 rounded-full'><Image/></motion.button>
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='rounded-full'><SmilePlus/></motion.button>
        <input value={inputValue} onChange={handleInputChange} className="w-[80%] h-[5.5vh] text-bar rounded-lg px-4" type="text" placeholder='Type a Message...'/>
        <motion.button onClick={sendMessageText} variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className={`rounded-full ${picToSendSelected ? 'mx-3' : 'none'}`}><SendHorizontal/></motion.button>
      </div>
    </section>
    {picToSendSelected && (
      <CardContainer className="z-10 inter-var">
        <CardBody className="bg-gray-50 relative w-auto  group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1]  sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            Send Image
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <img
              src={profilePicUrl}
              className="z-10 h-[27.7rem] w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-24">
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-3 rounded-xl text-xs font-normal dark:text-white"
              onClick={() => {setPicToSendSelected(false)}}
            >
              Close
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-3 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              Send
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
  )}
  </>
  )
}

async function sendMessageToConversation(conversationId, content, props) {
  return await axios.post(`http://localhost:3000/user/${props.user._id}/conversations/${conversationId}/message/text`, {
      content: content,
  }, {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
  });
}

function updateLocalStorageWithNewConversation(newConversation) {
  let conversations = JSON.parse(localStorage.getItem('conversations')) || [];

  //profile pic only shows after log back in (to avoid blob urls going bye bye)
  conversations.push(newConversation);
  localStorage.setItem('conversations', JSON.stringify(conversations));
}

function updateUIAndLocalStorageWithNewMessage(conversationId, newMessage, messages) {
  let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
  const index = conversations.findIndex(conv => conv._id === conversationId);

  if (index !== -1) {
      const profilePic = conversations[index].users[0].profilePic;
      conversations[index].lastMessage = newMessage.content.text; 
      conversations[index].messages.push(newMessage);

      if (profilePic) {
          conversations[index].users[0].profilePic = profilePic;
      }

      localStorage.setItem('conversations', JSON.stringify(conversations));
      messages.push(newMessage); 
  }
}