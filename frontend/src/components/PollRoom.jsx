import React, { useEffect, useState } from 'react';

function PollRoom({ roomData }) {
  const { socket, name, roomCode } = roomData;
  const [votes, setVotes] = useState({ optionA: 0, optionB: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    socket.emit('joinPoll', roomCode);

    socket.on('voteUpdate', (data) => {
      setVotes(data);
    });

    const voteRecord = localStorage.getItem(`voted-${roomCode}`);
    if (voteRecord) setHasVoted(true);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      socket.disconnect();
    };
  }, []);

  const vote = (option) => {
    if (hasVoted || timeLeft <= 0) return;
    socket.emit('vote', { roomCode, option });
    localStorage.setItem(`voted-${roomCode}`, 'true');
    setHasVoted(true);
  };

  return (
    <div >
      <h1 >Room: {roomCode}</h1>
      <h2>Time Left: {timeLeft}s</h2>
      <h3 >Cats vs Dogs</h3>
      <div >
        <button onClick={() => vote('optionA')} disabled={hasVoted || timeLeft <= 0} >Cats ({votes.optionA})</button>
        <button onClick={() => vote('optionB')} disabled={hasVoted || timeLeft <= 0} >Dogs ({votes.optionB})</button>
      </div>
      {hasVoted && <p >You have voted!</p>}
      
    </div>
  );
}

export default PollRoom;