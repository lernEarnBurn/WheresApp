import { SendHorizontal } from 'lucide-react';
import { Image } from 'lucide-react';
import { SmilePlus } from 'lucide-react';

import { motion } from 'framer-motion'

export function ConvInterface(){
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1},
  };
  
  return (
    <section className='w-[70%] h-full'>
      <div className="w-full h-[9%] bg-blue-500"></div>
      <div className="w-full h-[81%] bg-yellow-500"></div>
      <div className="w-full h-[10%] flex items-center gap-4 border border-l-0 border-gray-300">
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='ml-4 rounded-full'><Image/></motion.button>
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='rounded-full'><SmilePlus/></motion.button>
        <input className="w-[80%] h-[5.5vh] text-bar rounded-lg px-4" type="text" />
        <motion.button variants={buttonVariants} whileHover="hover" whileTap="rest"  initial="rest" className='rounded-full'><SendHorizontal/></motion.button>
      </div>
    </section>
  )
}