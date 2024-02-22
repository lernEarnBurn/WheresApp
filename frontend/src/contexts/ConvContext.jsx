import { createContext, useState } from "react";

export const ConvContext = createContext({
  recipient: [],
  setRecipient: ()  => {},
  messages: [],
  setMessages: () => {},
  status: '',
  setStatus: () => {},
  convId: '',
  setConvId: () => {}
  
})


// eslint-disable-next-line react/prop-types
export const ConvProvider = ({ children }) => {
  const [recipient, setRecipient] = useState([]);
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('')
  const [convId, setConvId] = useState('')

  return (
    <ConvContext.Provider value={{ recipient, messages, setRecipient, setMessages, status, setStatus, convId, setConvId }}>
      {children}
    </ConvContext.Provider>
  );
}
