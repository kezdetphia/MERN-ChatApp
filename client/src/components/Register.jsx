
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  const register = async (e) => {
    e.preventDefault();
    //destructing the data from the post res 
    const { data } = await axios.post("/register", { username, password });
    // This updates the context value for username
    setLoggedInUsername(username); 
    // This updates the context value for id
    setId(data.id); 
    //sets back the input field to blank
    setPassword("");
    setUsername("");
    console.log(data);
  };


  return (
    <div className="bg-green-50 h-screen flex items-center">
      <form className="w-800 mx-auto mb-12" onSubmit={register}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border "
        />
        <button className="bg-blue-500 text-white block w-full rounder-m pm-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
