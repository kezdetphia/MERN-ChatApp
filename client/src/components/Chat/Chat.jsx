import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Avatar from "./Avatar";
import Logo from "./Logo";
import uniqBy from 'lodash/uniqBy';


const Chat = () => {
  const [wsConnection, setWsConnection] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const { username, id } = useContext(UserContext);

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        // WebSocket connection setup
        const ws = new WebSocket(`ws://localhost:3030`);
        ws.addEventListener("message", handleMessage);
        setWsConnection(ws);
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
      //pairing the userId with the username and setting it to onlinePoeple state
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  //this is a WebSocket eventListener, therefore this event (e) is
  // referring to the websocket event which has a 'data' key
  const handleMessage = async (e) => {
    try {
      const messageData = await JSON.parse(e.data);
      console.log("message data Chat1:", messageData);

      if ("online" in messageData) {
         showOnLinePeople(messageData.online);
         console.log('online is in messagedata')
      } else if ('text' in messageData) {
        console.log('text is in messagedata')
        setMessages((prev)=> ([...prev, {...messageData}]))

      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  //submit form handling, sends the text and the userId
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await wsConnection.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessageText,
        })
        );
        setNewMessageText("");
        setMessages((prev) => [...prev, { text: newMessageText, isOur: false }]);
    } catch (err) {
      console.error(err);
    }
  };

  //new object from onlinepeople object state
  //that excludes 'me' the user from contacts list
  const onlinePeopleExcludingMe = { ...onlinePeople };
  delete onlinePeopleExcludingMe[id];

  const messagesNoDuplicates = uniqBy(messages,id)

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

      <div className="flex flex-col bg-pink-50 w-2/3 p-2 ">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-blue-600 flex items-center ">
                &larr; Select a person you want to <Logo />
              </div>
            </div>
          )}

          {selectedUserId && (
            <div>
              {messagesNoDuplicates.map((message, idx) => (
                <div key={idx}>{message.text}</div>
              ))}
            </div>
          )}
        </div>
        {selectedUserId && (
          <form onSubmit={handleSendMessage} className="flex gap-2 ">
            <input
              type="text"
              placeholder="Add your message here"
              className="rounded-sm bg-white border p-2 flex-grow"
              onChange={(e) => setNewMessageText(e.target.value)}
              value={newMessageText}
            />

            <button
              type="submit"
              className="rounded-sm bg-blue-500 p-2 text-white"
            >
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
