import { useState, useEffect } from "react"
import { SearchBar } from "./SearchBar"
import { motion } from 'framer-motion'

import axios from 'axios'

import PropTypes from 'prop-types'
import Buffer from 'buffer'

ConvColumn.propTypes = {
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
  logOutFunc: PropTypes.func.isRequired,
  displaySettings: PropTypes.func.isRequired
}


export function ConvColumn(props){
  const { conversations } = useGetConversations()
  
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
        {!props.user.profilePic ? (
            <div onClick={props.displaySettings} className="w-14 h-14 default-pic flex-shrink-0"></div>
        ) : (
            <div onClick={props.displaySettings} className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={props.user.profilePic}
                alt={`${localStorage.getItem('user').username}'s profile`}
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
            <div key={index} className="w-full h-[15%] border-b py-3 px-3 border-gray-300 flex items-center gap-3 hover-bg">
              {conv.users[0].profilePic ? (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
                <h2 className="text-gray-600 pr-2 truncate whitespace-nowrap">{/*conv.users[0].lastMessage*/}  This is a dummy last Message </h2>
              </div>
            </div>
          ))
        ) : (
          contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <div key={index} className="w-full h-[15%] border-b py-4 px-3 border-gray-300 flex items-center gap-3 hover-bg">
                {contact.profilePic ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
                  <h2 className="text-gray-600 text-sm max-h-[2.6em] mr-2 overflow-hidden">flex-shrink-0flex-shrink-0 flex-shrink-0 flex-shrink-0 flex-shrink-0 flex-shrink-0 flex-shrink-0 flex-shrink-0</h2>
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
  

function useGetConversations(){
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const convRequest = async() => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${JSON.parse(localStorage.getItem('user'))._id}/conversations`, {
                                            headers: {
                                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                                            }
                                          })

        response.data.forEach((conv) => {
          if(conv.users[0]._id === JSON.parse(localStorage.getItem('user'))._id){
            conv.users[0] = conv.users[1]
          }
        })
        setConversations(response.data)
      } catch (err){
        console.log(err)
      }
    }

    convRequest()
  }, [])

  return { conversations }

}