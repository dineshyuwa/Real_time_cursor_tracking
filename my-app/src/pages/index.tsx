import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setUsername, updateCursorPositions } from '../redux/actions';
import io from 'socket.io-client';
import { CursorPosition } from '../redux/types';

const socket = io('http://localhost:5000'); // Socket.io client connection

const Home = () => {
  const dispatch = useDispatch();
  const [username, setName] = useState('');
  const cursorPositions = useSelector((state: RootState) => state.cursorPositions) as { [key: string]: CursorPosition };
  const nameInputRef = useRef<HTMLInputElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    socket.on('cursorPositions', (positions: any) => {
      dispatch(updateCursorPositions(positions));
    });

    return () => {
      socket.disconnect(); // Disconnect socket when unmounting component
    };
  }, [dispatch]);
    
  useEffect(() => {
    // Update the cursor position when username changes
    const socketId = socket.id;
    updateCursorPositions((prevPositions: { [x: string]: any; }) => ({
      ...prevPositions,
      [socketId]: {
        ...prevPositions[socketId],
        username,
      },
    }));
  }, [username]);


    const handleUsernameSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Emit socket event to update the username on the server
        socket.emit('updateUsername', { username });
        socket.emit('cursorPosition', { cursorPosition: { x: 0, y: 0 } });

    // Focus on the name input field
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
      dispatch(setUsername(username));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    socket.emit('cursorPosition', { username, x: clientX, y: clientY });
  };

  const handleCursorClick = (e: React.MouseEvent) => {
    // Handle cursor click event here
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };
    
  return (
    <div style={{ height: '100vh', background: '#FFF' }} onMouseMove={handleMouseMove}>
      <h1>Cursor Tracking App</h1>
      <form onSubmit={handleUsernameSubmit}>
        <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setName(e.target.value)} ref={nameInputRef}/>
        <button type="submit">Save</button>
      </form>
      <div>
              {Object.entries(cursorPositions).map(([name, position]) => {
                  return (
                    <div key={name} style={{ position: 'absolute', left: position.x, top: position.y }} onClick={handleCursorClick}>
                    <img src="/download1.png" alt="Cursor" style={{ height:"40px", width:"40px" }}/>
                    <span>{name}</span>
                  </div>
                  )
              }
        )}
      </div>
    </div>
  );
};

export default Home;