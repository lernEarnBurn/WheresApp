import { SendHorizontal } from 'lucide-react';
import { Image } from 'lucide-react';
import { SmilePlus } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

import { motion } from 'framer-motion'
import { useContext, useEffect } from 'react';

import { ConvContext } from '../contexts/ConvContext';


export function ConvInterface(){
  const { recipient, messages, status } = useContext(ConvContext)

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1},
  };


  useEffect(() => {
    console.log(`Recipient: ${JSON.stringify(recipient)}`)
    console.log(`Messages: ${JSON.stringify(messages)}`)
    console.log(`status ${JSON.stringify(status)}`)
  }, [recipient, messages, status])
  
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


      <div className="w-full h-[81%] flex flex-col gap-5 user-input-bg border border-b-0 py-10 px-16 border-gray-300 overflow-y-scroll">
        <div className="message">Hello! This is a sent message.</div>
        <div className="message received">And this is a reply.</div>
      </div>


      <div className="w-full h-[10%] flex items-center gap-4 border border-l-0 border-gray-300">
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='ml-4 rounded-full'><Image/></motion.button>
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='rounded-full'><SmilePlus/></motion.button>
        <input className="w-[80%] h-[5.5vh] text-bar rounded-lg px-4" type="text" placeholder='Type a Message...'/>
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='rounded-full'><SendHorizontal/></motion.button>
      </div>
    </section>
  )
}