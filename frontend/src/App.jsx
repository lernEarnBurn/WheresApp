import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion'

import { Menu } from "./components/Menu";
import { Login } from "./components/Login";

function App() {
  /*
    gonna be a single page with 3 components
    -the conversationn column wiht searchbar on top (may make search bar its own component)
    -the right side of screen where each conversation will be displayed and 
    -in top left corner above search bar it will toggle the conversation column to user settings
  */
  const location = useLocation()
  const navigate = useNavigate()

  
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
          <Route path='/WheresApp' element={ localStorage.getItem('token') ? navigate('/WheresApp/Login') : navigate('/WheresApp/Menu')}/>
          <Route path='/WheresApp/Menu' element={<Menu/>}/>
          <Route path='/WheresApp/Login' element={<Login/>}/>
      </Routes> 
    </AnimatePresence>
  );
}

export default App;
