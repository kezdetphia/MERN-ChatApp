import { useState } from 'react'
import Register from './components/Register'
import axios from 'axios'
import {UserContext, UserContextProvider } from './context/UserContext'
import { useContext } from "react";



function App() {
  axios.defaults.baseURL = 'http://localhost:3030'
  //to set our cookies from api
  axios.defaults.withCredentials= true
  const {username } = useContext(UserContext)
  console.log(username)

  return (
    <>
      <div >
        <UserContextProvider>
          <Register />
        </UserContextProvider>
      </div>
    </>
  )
}

export default App
