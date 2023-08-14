//Import necessary modules and components
import { UserContext } from "../../context/UserContext";
import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import Contact from "./Contact";
import Logo from "./Logo";
import uniqBy from "lodash/uniqBy";

const Chat = () => {
  //State variables for managing various aspects of the Chat
  const [ws, setWs] = useState(null); //Websocket connection
  const [onlinePeople, setOnlinePeople] = useState({}); //Online users
  const [offlinePeople, setoffLinePeople] = useState({}); //Offlune users
  const [selectedUserId, setSelectedUserId] = useState(null); //Selected user's ID
  const [newMessageText, setNewMessageText] = useState(""); //New message input
  const [messages, setMessages] = useState([]); //List of messages
  const divUnderMessages = useRef(null); //Reference for scrolling to the latest message
  const { username, id, setId, setUsername } = useContext(UserContext); //User context data for logged in user

  //Set up WebSocet connection when component mounts
  useEffect(() => {
    connectToWs();
  }, []);

  //Function to establish a WebSocket connection
  const connectToWs = () => {
    const ws = new WebSocket(`ws://localhost:3030`);
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      console.log("Disconnected. Trying to reconnect");
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  };
  //Function to display online people
  const showOnLinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      //pairing the userId with the username and setting it to onlinePoeple state
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  //Even listener for WebSocket messages
  //Event is a websocket event
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    console.log({ e, messageData });
    if ("online" in messageData) {
      showOnLinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  };

  //Function to send a text or file message
  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    try {
      ws.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessageText,
          file: file,
        })
      );
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  //Function to handle file upload
  // const sendFile = (e) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(e.target.files[0]);
  //   reader.onload = () => {
  //     sendMessage(null, {
  //       name: e.target.files[0].name,
  //       data: reader.result,
  //     });
  //   };
  // };

  //Function to log out user
  const logOut = () => {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  };

  //useEffects
  //useEffects tp scroll to the latest message when messages change
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  //UseEffect to fetch offline users
  useEffect(() => {
    // '/people' fetch every user then filtering out the actual user(me) and people that are online
    axios.get("/people").then((res) => {
      const offlinePeopleArray = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      // const offlinePeopleArray = differenceBy(res.data, Object.keys(onlinePeople), "_id");
      const offlinePeople = {};
      offlinePeopleArray.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setoffLinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  //useEffect to fetch messages for the selected user
  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  //Create and object of online people excluding the current user(me)
  const onlinePeopleExcludingMe = { ...onlinePeople };
  delete onlinePeopleExcludingMe[id];
  //Remove duplicate messages based on database ID
  const messagesNoDuplicates = uniqBy(messages, "_id");

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 border border-gray-400 shadow-lg flex flex-col ">
        <div className="flex-grow">
          <Logo />
          {Object.entries(onlinePeopleExcludingMe).map(([userId, username]) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExcludingMe[userId]}
              onClick={() => {
                setSelectedUserId(userId);
                console.log(username);
              }}
              selected={userId === selectedUserId}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username} // Access the username using the user ID
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
        </div>

        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-4 pr-3 text-sm text-gray-400 items-center flex ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 "
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
            {username}
          </span>

          <button
            className="absolutetext-sm text-gray-400 py-1 px-2 bg-gray-100 border rounded-sm shadow-gray-200 shadow-lg"
            onClick={logOut}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-gray-100 w-2/3 p-2 ">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-blue-600 flex items-center ">
                &larr; Select a person you want to <Logo />
              </div>
            </div>
          )}

          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute inset-0 ">
                {messagesNoDuplicates.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "text-left inline-block p-2 m-2 rounded-lg text-sm " +
                        (message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {/* sender:{message.sender} <br />
                      my id: {id} <br /> */}
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form onSubmit={sendMessage} className="flex gap-2 ">
            <input
              type="text"
              placeholder="Add your message here"
              className="rounded-sm bg-white border p-2 flex-grow"
              onChange={(e) => setNewMessageText(e.target.value)}
              value={newMessageText}
            />
            {/* <label
              type="button"
              className="bg-gray-300 p-2 text-blue-500 cursor-pointer "
            >
              <input type="file" className="hidden" onChange={sendFile} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 "
              >
                <path
                  fillRule="evenodd"
                  d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                  clipRule="evenodd"
                />
              </svg>
            </label> */}
            <button type="file" className=" text-blue-500 "></button>

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
