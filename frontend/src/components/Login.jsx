import { useState } from "react"

export function Login(){
  const [logIn, setLogin] = useState(true)
  //maybe add a modal to put inputs and stuff on
  return (
    <section className="logo-bg h-[100vh] w-[100vw] grid place-items-center">
      {logIn ? (
        <div className="flex flex-col gap-3 w-[16vw]">

          <div className="flex flex-col">
            <label name="username">Username</label>
            <input type="text" placeholder="username" />
          </div>
          <div className="flex flex-col">
            <label name="password">Password</label>
            <input type="password" placeholder="password" />          
          </div>
          <button className="mt-2">Submit</button>
        </div>
      ): (
        <div className="flex flex-col gap-3">
          <label name="username">Username</label>
          <input type="text" placeholder="username" />
          <label name="password">Password</label>
          <input type="password" placeholder="password" />          
          <button className="mt-2">Submit</button>
        </div>
      )}
    </section>
  )
}