import { UserContext } from "../../context/UserContext";
import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import Contact from "./Contact";
import Logo from "./Logo";
import uniqBy from "lodash/uniqBy";
import differenceBy from "lodash/differenceBy";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setoffLinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const divUnderMessages = useRef(null);

  const { username, id } = useContext(UserContext);

  useEffect(() => {
    connectToWs();
  }, []);

  const connectToWs = () => {
    // WebSocket connection setup
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
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    console.log({ e, messageData });
    if ("online" in messageData) {
      showOnLinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  };

  //submit form handling, sends the text and the userId
  const sendMessage = (e) => {
    e.preventDefault();
    try {
      ws.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessageText,
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

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  //getting all people except for us and who is NOT online
  useEffect(() => {
    axios.get("/people").then((res) => {
      console.log("this is res.data", res.data);
      const offlinePeopleArray = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      // const offlinePeopleArray = differenceBy(res.data, Object.keys(onlinePeople), "_id");
      const offlinePeople = {};
      offlinePeopleArray.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setoffLinePeople(offlinePeople);
      console.log("this is offlinePeople ", offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  //new object from onlinepeople object state
  //that excludes 'me' the user from contacts list
  const onlinePeopleExcludingMe = { ...onlinePeople };
  delete onlinePeopleExcludingMe[id];

  const messagesNoDuplicates = uniqBy(messages, "_id");
  console.log("onlineexcliding me", onlinePeopleExcludingMe);
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 border border-gray-400 shadow-lg ">
        <Logo />
        {username}
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
