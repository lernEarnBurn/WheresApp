import { useState } from "react"

export function Login(){
  const [logIn, setLogin] = useState(true)

  return (
    <>
      {logIn ? (
        <button onClick={() => {setLogin(false)}}>Login</button>
      ): (
        <button onClick={() => {setLogin(true)}}>Signup</button>
      )}
    </>
  )
}