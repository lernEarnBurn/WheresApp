import { SendHorizontal } from 'lucide-react';
import { Image } from 'lucide-react';
import { SmilePlus } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

import { motion } from 'framer-motion'

export function ConvInterface(){
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1},
  };
  
  return (
    <section className='w-[70%] h-full'>
      <div className="w-full h-[9%] flex gap-3 items-center border-x border-gray-300">
        
        <div className="ml-5 w-14 h-14 default-pic flex-shrink-0"></div>
        <div className='flex flex-col mb-1  overflow-hidden max-w-[23vw]'>
          <h1 className='text-lg truncate font-semibold'>Contacts Name</h1>
          <h2 className='text-xs truncate'>This is my description and it is long</h2>
        </div>
        <MoreVertical className='ml-[45.5vw]'/>
      </div>
      <div className="w-full h-[81%] user-input-bg border border-b-0  border-gray-300"></div>
      <div className="w-full h-[10%] flex items-center gap-4 border border-l-0 border-gray-300">
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='ml-4 rounded-full'><Image/></motion.button>
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='rounded-full'><SmilePlus/></motion.button>
        <input className="w-[80%] h-[5.5vh] text-bar rounded-lg px-4" type="text" />
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='rounded-full'><SendHorizontal/></motion.button>
      </div>
    </section>
  )
}