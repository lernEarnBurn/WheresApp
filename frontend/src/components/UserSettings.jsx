import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

UserSettings.propTypes = {
  removeDisplaySettings :  PropTypes.func.isRequired,
}

export function UserSettings(props){
  
  return (   
    <motion.section initial={{x: -700}} animate={{x: 0}} exit={{x: -700}} transition={{duration: .3}} className='w-full h-full flex flex-col overflow-hidden'>
      <div onClick={props.removeDisplaySettings} className="bg-blue-500 w-full h-[18%]"></div>
      <div className="bg-black w-full h-[82%]"></div>
    </motion.section>
  )
}