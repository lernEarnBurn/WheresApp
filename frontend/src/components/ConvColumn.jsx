import { SearchBar } from "./SearchBar"

export function ConvColumn(){

  return (
    <section className='w-[30%] h-full flex flex-col'>  
      <div className="w-full h-[10%] bg-green-500"></div>
      <SearchBar/>
      <div className="w-full h-[82%] bg-red-500"></div>
    
    </section>
  )
}