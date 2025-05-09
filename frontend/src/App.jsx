import React, { useState } from 'react';
import JoinRoom from './components/JoinRoom';
import PollRoom from './components/PollRoom'
import './App.css'

function App() {
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomData, setRoomData] = useState(null);

  return (
    <div className='App'>
      {!roomJoined ? (
        <JoinRoom onJoin={(data) => {
          setRoomData(data);
          setRoomJoined(true);
        }} />
      ) : (
        <PollRoom roomData={roomData} />
      )}
    </div>
  );
}

export default App;