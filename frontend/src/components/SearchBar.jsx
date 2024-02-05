import { useEffect, useState } from "react"

import axios from 'axios'

export function SearchBar(){
  const [searchVal, setSearchVal] = useState('')

  const handleSearchChange = (event) => {
    setSearchVal(event.target.value)
  }

  //need to figure out how im gonna display search results
  useEffect(() => {
    const handleSearch = async() => {
      console.log(searchVal)
      const searchResponse = await axios.post('http://localhost:3000/user',
      {
        searchQuery: searchVal
      },
       {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })
      console.log(searchResponse)
    }
    handleSearch()

  }, [searchVal])

  return (
    <section className="w-full h-[8%] grid place-items-center  border-gray-300 border-b border-t">
      <input onChange={handleSearchChange} type="text" className="search-bar h-8 w-[90%] rounded-2xl"></input>
      <svg className="svg"></svg>
    </section>
  )
}