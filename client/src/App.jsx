import { useState } from 'react'
import Register from './components/Register'
import axios from 'axios'


function App() {
  axios.defaults.baseURL = 'http://localhost:3030'
  //to set our cookies from api
  axios.defaults.withCredentials= true

  return (
    <>
      <div >
        <Register />
      </div>
    </>
  )
}

export default App
