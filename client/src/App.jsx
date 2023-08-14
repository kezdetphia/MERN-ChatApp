import RegisterAndLoginForm from './components/RegisterAndLoginForm'
import Chat from './components/Chat/Chat'

import axios from 'axios'
import {UserContext, UserContextProvider } from './context/UserContext'
import { useContext } from "react";
import Routes from './components/Routes';


function App() {
  axios.defaults.baseURL = 'http://localhost:3030'
  //to set our cookies from api
  axios.defaults.withCredentials= true
  const {username } = useContext(UserContext)
  console.log('this is logged in username:',username)

  return (
    <>
      <div>
        <UserContextProvider>
          <Routes />
        </UserContextProvider>
      </div>
    </>
  );
};

export default App;