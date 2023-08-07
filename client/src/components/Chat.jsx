import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';

const Chat = () => {
  const [wsConnection, setWsConnection] = useState(null)
  const [onlinePeople, setOnlinePeople] = useState({})

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        // WebSocket connection setup
        const ws = new WebSocket(`ws://localhost:3030`);
        setWsConnection(ws);

        ws.addEventListener('message', handleMessage)

        // await new Promise((resolve) => {
        //   ws.onopen = () => {
        //     console.log('WebSocket connection established.');
        //     resolve(); // Resolve the promise when the WebSocket connection is open
        //   };
        // });

        // ws.onmessage = (event) => {
        //   console.log('Received message:', event.data);
        //   // Process the incoming WebSocket messages
        // };

        // ws.onclose = () => {
        //   console.log('WebSocket connection closed.');
        //   // Handle WebSocket connection close
        // };
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
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


  const showOnLinePeople=(peopleArray)=>{
    const people = {};
    peopleArray.forEach(({userId, username})=>{
      people[userId] = username
    })
    setOnlinePeople(people)
  }


  const handleMessage = (e)=>{
    const messageData = JSON.parse(e.data)
    console.log(messageData)
    if('online' in messageData){
      showOnLinePeople(messageData.online)
    }
  }

  return (
    <div className="flex h-screen ">

      <div className="bg-white-100 w-1/3 pl-4 pt-4" >
        <div className='text-blue-600 font-bold flex gap-2 mb-4' >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9M6 11.25h6M5.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501c1.153-.086 2.294-.213 3.423-.379C17.127 15.754 18.25 14.36 18.25 12.76v-6.018c0-1.602-1.123-2.995-2.707-3.228C15.057 3.209 13.916 3.082 12.763 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          ChatMe
        </div>
        {Object.entries(onlinePeople).map(([id, user])=>(
          <div className='border-b border-gray-100 py-2 flex items-center gap-2 cursor-pointer' key={id}>
            <Avatar username={user} userId={id} />
            <span className='text-gray-500 font-bold'>{user}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-violet-100 w-2/3 p-2 ">
        <div className="flex-grow">
          MESSAGES WITH SELECTED Person
        </div>
        <div className="flex gap-2 ">
          <input 
            type="text" 
            placeholder='Add your message here' 
            className="rounded-sm bg-white botder p-2 flex-grow border">
          </input>
          <button  className="rounded-sm bg-blue-500 p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Chat;

