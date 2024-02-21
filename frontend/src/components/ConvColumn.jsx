import { useState, useEffect, useContext } from "react"
import { SearchBar } from "./SearchBar"
import { motion } from 'framer-motion'
import axios from 'axios'

import PropTypes from 'prop-types'

import { ConvContext } from "../contexts/ConvContext"

ConvColumn.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profilePic: PropTypes.string.isRequired,
  }),
  logOutFunc: PropTypes.func.isRequired,
  displaySettings: PropTypes.func.isRequired,
  profilePic: PropTypes.string
}


export function ConvColumn(props){
  const { setRecipient, setMessages, setStatus } = useContext(ConvContext)

  const setConvContext = (newRecipient, newStatus, newMessages) => {
    setRecipient(newRecipient)
    if(newStatus === 'exist'){
      setMessages(newMessages)
    }
    setStatus(newStatus)
  }

  const { conversations } = useGetConversations(props.user)
  
  const [displayConvs, setDisplayConvs] = useState(true)
  const [contacts, setContacts] = useState([])

  function addContacts(contacts){
    setDisplayConvs(false)
    setContacts(contacts)
  }

  function backToConvDisplay(){
    setDisplayConvs(true)
  }


  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1},
  };

  return (
    <motion.section  className='overflow-hidden w-full h-full flex flex-col '>  
      <div className="w-full h-[10%] py-2 px-5 flex justify-between items-center">
        {!props.profilePic ? (
            <div onClick={props.displaySettings} className="w-14 h-14 default-pic flex-shrink-0"></div>
        ) : (
            <div onClick={props.displaySettings} className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={props.profilePic}
                alt={`${props.user.username}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
        )}
        <motion.button
            onClick={props.logOutFunc}
            className="h-10 text-sm font-semibold"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="rest" 
            initial="rest"
          >Log Out</motion.button>
      </div>
      <SearchBar addContacts={addContacts} backToConvDisplay={backToConvDisplay}/>
      <div className="w-full h-[82%] flex flex-col overflow-y-scroll">
        {displayConvs ? (
          conversations.map((conv, index) => (
            <div onClick={() => setConvContext(conv.users[0], 'exist', conv.messages)} key={index} className="w-full h-[15%] border-b py-3 px-3 border-gray-300 flex items-center gap-3 hover-bg">
              {conv.users[0].profilePic ? (
                <div className="w-14 h-14 mx-1 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={conv.users[0].profilePic}
                    alt={`${conv.users[0].username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 default-pic flex-shrink-0"></div>
              )}
  
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-lg font-semibold">{conv.users[0].username}</h1>
                <h2 className="text-gray-600 pr-2 truncate whitespace-nowrap">{}  This is a dummy last Message </h2>
              </div>
            </div>
          ))
        ) : (
          contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <div onClick={() => { setConvContext(contact, 'new', [])} } key={index} className="w-full h-[15%] border-b py-4 px-3 border-gray-300 flex items-center gap-3 hover-bg">
                {contact.profilePic ? (
                  <div className="w-14 h-14 mx-1 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={contact.profilePic}
                      alt={`${contact.username}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 default-pic flex-shrink-0"></div>
                )}
  
                <div className="flex flex-col mb-3 mt-1">
                  <h1 className="text-lg font-semibold">{contact.username}</h1>
                  <h2 className="text-gray-600 text-sm max-h-[2.6em] mr-2 overflow-hidden">{contact.description}</h2>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg pt-6 mx-auto">No contacts to display.</p>
          )
        )}
      </div>
    </motion.section>
  )}
  

function useGetConversations(user){
  const [conversations, setConversations] = useState(() => {
    const storedConversations = localStorage.getItem('conversations');
    try {
      return storedConversations ? JSON.parse(storedConversations) : [];
    } catch (error) {
      console.error("Error parsing conversations from localStorage:", error);
      return [];
    }
  });
  

  useEffect(() => {
    const convRequest = async() => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${user._id}/conversations`, {
                                            headers: {
                                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                                            }
                                          })

        response.data.forEach((conv) => {
          if(conv.users[0]._id === user._id){
            conv.users[0] = conv.users[1]
          }

          if(conv.users[0].profilePic){
            const uintArray = new Uint8Array(conv.users[0].profilePic.image.data.data);
            const blob = new Blob([uintArray], { type: 'image/jpeg' });
            const picUrl = URL.createObjectURL(blob)
            conv.users[0].profilePic = picUrl
          }
        })
        
        localStorage.setItem('conversations', JSON.stringify(response.data));
        setConversations(response.data)
        console.log(response.data)
        
      } catch (err){
        console.log(err)
      }
    }
    if(!localStorage.getItem('conversations')){
      convRequest()
    }
  }, [])

  return { conversations }

}

