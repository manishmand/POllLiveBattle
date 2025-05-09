import React, { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io();

function JoinRoom({ onJoin }) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const createRoom = () => {
    socket.emit('createRoom', { name }, (roomInfo) => {
      onJoin({ socket, name, roomCode: roomInfo.code });
    });
  };

  const joinRoom = () => {
    socket.emit('joinRoom', { name, roomCode }, (success) => {
      if (success) onJoin({ socket, name, roomCode });
      else alert('Room not found!');
    });
  };

  return (
    <div >
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" />
      <input value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="Enter Room Code (or leave blank to create)" />
      <div >
        <button onClick={createRoom} >Create Room</button>
        <button onClick={joinRoom} >Join Room</button>
      </div>
    </div>
  );
}

export default JoinRoom;