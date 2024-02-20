import { useEffect, useState } from "react"

import axios from 'axios'
import PropTypes from 'prop-types'

SearchBar.propTypes = {
  addContacts: PropTypes.func.isRequired,
  backToConvDisplay: PropTypes.func.isRequired
};

export function SearchBar(props){
  const [searchVal, setSearchVal] = useState('')

  const handleSearchChange = (event) => {
    setSearchVal(event.target.value)
  }

  useEffect(() => {
    const handleSearch = async() => {
      if(searchVal !== ''){
        const searchResponse = await axios.post('http://localhost:3000/user',
        {
          searchQuery: searchVal
        },
         {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        })

        searchResponse.data.forEach((contact) => {
          if(contact.profilePic){
            const uintArray = new Uint8Array(contact.profilePic.image.data.data);
            const blob = new Blob([uintArray], { type: 'image/jpeg' });
            const picUrl = URL.createObjectURL(blob)
            contact.profilePic = picUrl
          }
        })

        props.addContacts(searchResponse.data)
      }else{
        props.backToConvDisplay()
      }
    }
    handleSearch()

  }, [searchVal])

  return (
    <section className="w-full h-[8%] grid place-items-center  border-gray-300 border-b border-t">
      <input onChange={handleSearchChange} type="text" className="mt-[.65rem] search-bar pt-1 h-8 w-[90%] rounded-2xl"></input>
      <div className="svg"></div>
    </section>
  )
}