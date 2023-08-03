import { createContext, useState, useEffect } from "react";
import axios from "axios";

//Creating a global state
//calling usercontextprovider in app.js
export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/profile");
        if (response.status === 200) {
          setId(response.data.userId);
          setUsername(response.data.username);
        } else {
          console.error("Failed to fetch profile data ");
        }
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};
