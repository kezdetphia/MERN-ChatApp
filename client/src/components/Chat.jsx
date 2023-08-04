import React, { useEffect, useState } from 'react';

const Chat = () => {
  const [wsConnection, setWsConnection] = useState(null)

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        // WebSocket connection setup
        const ws = new WebSocket(`ws://localhost:3030`);
        setWsConnection(ws);

        await new Promise((resolve) => {
          ws.onopen = () => {
            console.log('WebSocket connection established.');
            resolve(); // Resolve the promise when the WebSocket connection is open
          };
        });

        ws.onmessage = (event) => {
          console.log('Received message:', event.data);
          // Process the incoming WebSocket messages
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed.');
          // Handle WebSocket connection close
        };
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

  // useEffect(() => {
  
  //   // WebSocket connection setup
  //   const ws = new WebSocket(`ws://localhost:3030`);
  //   setWsConnection(ws)

  //   ws.onopen = () => {
  //      console.log('WebSocket connection established.');
  //     // You can send initial data to the WebSocket server if needed
  //   };

  //   ws.onmessage = (event) => {
  //     console.log('Received message:', event.data);
  //     // Process the incoming WebSocket messages
  //   };

  //   ws.onclose = () => {
  //     console.log('WebSocket connection closed.');
  //     // Handle WebSocket connection close
  //   };

  //   return () => {
  //     // Clean up the WebSocket connection when the component unmounts
  //     ws.close();
  //   };
  // }, []);

  

  return (
    <div className="flex h-screen ">

      <div className="bg-white-100 w-1/3">
        CONTAct
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Chat;

