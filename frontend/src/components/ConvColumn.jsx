import { useState, useEffect } from "react"
import { SearchBar } from "./SearchBar"

import axios from 'axios'

export function ConvColumn(){
  const { conversations } = useGetConversations()

  //need to have the person who's not u in conversation's name added tp the data object
  //backend issue


  return (
    <section className='w-[30%] h-full flex flex-col'>  
      <div className="w-full h-[10%]"></div>
      <SearchBar/>
      <div className="w-full h-[82%] flex flex-col overflow-y-scroll">
        {conversations.map((conv, index) => (
          <div key={index} className="w-full h-[15%] border-b py-4 px-3 border-gray-300 flex items-center gap-3 hover-bg">
            {conv.users[0].profilePic ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={conv.users[0].profilePic}
                  alt={`${conv.users[0].username}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 default-pic"></div>
            )}

            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">{conv.users[0].username}</h1>
              <h2 className="text-gray-600">{/*conv.users[0].lastMessage*/} This is a dummy last Message</h2>
            </div>
          </div>
        ))}
        
      </div>
    
    </section>
  )
}

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