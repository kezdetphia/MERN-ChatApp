import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");

  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    //allows to fetch different paths based on the update of the state
    const url = isLoginOrRegister === 'register' ? 'register' : 'login'
    //destructing the data from the post res
    //using a string as the path without the leading slash to define relative path to this location
    const { data } = await axios.post(url, { username, password });
    // This updates the context value for username
    setLoggedInUsername(username);
    // This updates the context value for id
    setId(data.id);
    //sets back the input field to blank
    setPassword("");
    setUsername("");
    console.log(data);
  }

  return (
    <div className="bg-green-50 h-screen flex items-center">
      <form className="w-800 mx-auto mb-12" onSubmit={handleSubmit}>
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
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-m p-2">
          {isLoginOrRegister === 'register' ? 'register' : 'login'}
        </button>

        <div className="mt-2 text-center">
          {isLoginOrRegister === 'register' && (
            <div>
              Already Registered?
              <button onClick={() => setIsLoginOrRegister('login')}>
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div>
              Don't have an Account?
              <button onClick={() => setIsLoginOrRegister('register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
