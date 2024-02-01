import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'
import axios from 'axios'

export function Login(){
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.03},
  };

  const navigate = useNavigate()

  const [usernameValue, setUsernameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const [triggerLoginAnim, setTriggerLoginAnim] = useState(false)

  const handleUsernameChange = (event) => {
    setUsernameValue(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPasswordValue(event.target.value)
  }


  async function submitDetails(){
    if(usernameValue.trim() != '' && passwordValue.trim() != ''){
      setTriggerLoginAnim(true)
      try{
        const response = await axios.post('http://localhost:3000/log-in',
                                      {username: usernameValue, password: passwordValue}
                                    )
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        

        navigate('/WheresApp/Menu')
      }catch(err){
        console.log(err)
      }
    }else{
      console.log('please enter values. This should be easy being as there is no mandatory constraints. Just enter anything.')
      const username = document.querySelector('#username')
      const password = document.querySelector('#password')

      if(usernameValue.trim() === '' && passwordValue !== ''){
        username.classList.add('error')
      }else if(passwordValue.trim() === '' && usernameValue !== ''){
        password.classList.add('error')
      }else{
        username.classList.add('error')
        password.classList.add('error')
      }
    }
  }
  
  return (
    <>
      {triggerLoginAnim ? ( <motion.section
          animate={{ y: 0 }} 
          exit={{ y: -1000 }} 
          transition={{ duration: 0.3 }} 
          className="logo-bg h-[100vh] w-[100vw] grid place-items-center">
          
        <div className="flex flex-col gap-3 w-[16vw]">
          <div className="flex flex-col">
            <label name="username">Username</label>
            <input onChange={handleUsernameChange} type="text" placeholder="username" id="username" />
          </div>
          <div className="flex flex-col">
            <label name="password">Password</label>
            <input onChange={handlePasswordChange} type="password" placeholder="password" id="password" />          
          </div>
          <motion.button
            onClick={submitDetails}
            className="mt-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="rest" 
            initial="rest"
          >
            Submit
          </motion.button>
          <div className="flex gap-1 text-sm justify-center mt-[-.75vh]">
            <p>Click here to</p>
            <a className="font-bold" onClick={() => {navigate('/WheresApp/Signup')}}>Signup</a>
          </div>
        </div>
      </motion.section> ) :
      ( 
          <section className="logo-bg h-[100vh] w-[100vw] grid place-items-center">
            <div className="flex flex-col gap-3 w-[16vw]">
            <div className="flex flex-col">
              <label name="username">Username</label>
              <input onChange={handleUsernameChange} type="text" placeholder="username" id="username" />
            </div>
            <div className="flex flex-col">
              <label name="password">Password</label>
              <input onChange={handlePasswordChange} type="password" placeholder="password" id="password" />          
            </div>
            <motion.button
              onClick={submitDetails}
              className="mt-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="rest" 
              initial="rest"
            >
              Submit
            </motion.button>
            <div className="flex gap-1 text-sm justify-center mt-[-.75vh]">
              <p>Click here to</p>
              <a className="font-bold" onClick={() => {navigate('/WheresApp/Signup')}}>Signup</a>
            </div>
          </div>
        </section>
      )}
    </>
  )
}