import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion'

import { Menu } from "./components/Menu";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation()

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, []);

  
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
          <Route path='/WheresApp/' element={ isLoggedIn ? <Navigate to='/WheresApp/Login'/> : <Navigate to='/WheresApp/Menu'/>}/>
          <Route path='/WheresApp/Menu' element={<Menu/>}/>
          <Route path='/WheresApp/Login' element={<Login/>}/>
          <Route path='/WheresApp/Signup' element={<Signup/>}/>
      </Routes> 
    </AnimatePresence>
  );
}

export default App;
