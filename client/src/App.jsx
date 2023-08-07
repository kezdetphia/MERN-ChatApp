import RegisterAndLoginForm from './components/RegisterAndLoginForm'
import Chat from './components/Chat'

import axios from 'axios'
import {UserContext, UserContextProvider } from './context/UserContext'
import { useContext } from "react";


function App() {
  axios.defaults.baseURL = 'http://localhost:3030'
  //to set our cookies from api
  axios.defaults.withCredentials= true
  const {username } = useContext(UserContext)
  console.log(username)

  if(username){
    return 'logged in' + username
  }


  return (
    <>
      <div >
        <UserContextProvider>
          <Chat/>
          <RegisterAndLoginForm /> 
        </UserContextProvider>
      </div>
    </>
  )
}

export default App
