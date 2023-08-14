import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Chat from "./Chat/Chat";


const Routes = () => {
  const {username, id} = useContext(UserContext)
  
  if(username){
    return <Chat />
  }

  return(
    <RegisterAndLoginForm />
  )
};

export default Routes;