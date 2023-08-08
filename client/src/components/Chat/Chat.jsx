import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Avatar from "./Avatar";
import Logo from "./Logo";

const Chat = () => {
  const [wsConnection, setWsConnection] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('')

  const { username, id } = useContext(UserContext);

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        // WebSocket connection setup
        const ws = new WebSocket(`ws://localhost:3030`);
        setWsConnection(ws);
        ws.addEventListener("message", handleMessage);
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
      }
    };
    setupWebSocket();

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, []);

  const showOnLinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    console.log(messageData);
    if ("online" in messageData) {
      showOnLinePeople(messageData.online);
    }
  };

  const onlinePeopleExcludingMe = { ...onlinePeople };
  delete onlinePeopleExcludingMe[id];

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 border border-gray-400 shadow-lg ">
        <Logo />
        {username}
        {Object.entries(onlinePeopleExcludingMe).map(([userId, user]) => (
          <div
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={
              "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUserId ? "bg-blue-200" : "")
            }
          >
            {userId === selectedUserId && (
              <div className=" w-1 bg-blue-500 h-12 rounded-r-md "></div>
            )}

            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar username={user} userId={userId} />
              <span className="text-gray-500 font-bold">{user}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-green-200 w-2/3 p-2 ">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-400"> 
                &larr; Select a person you want to ChatMe
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 ">
          <input
            type="text"
            placeholder="Add your message here"
            className="rounded-sm bg-white border p-2 flex-grow"
            onChange={e => setNewMessageText(e.target.value)} 
            
            value={newMessageText}

          />
        
          <button className="rounded-sm bg-blue-500 p-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;