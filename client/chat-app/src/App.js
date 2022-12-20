import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Components/Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const users = {};
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const disconnect = () => {
    console.log("disconnecting user: ", username);
    socket.emit("disconnect_user", room);
    delete users[username];
    setRoom("");
    setJoined(false);
  };
  const joinRoom = () => {
    if (users[username] == null) {
      if (room !== "" && username !== "") {
        socket.emit("join_room", room);
        users[username] = 1;
        console.log(`username: ${username}, joined chat room: ${room}`);
        setJoined(true);
      } else {
        console.log("username or room input fields are missing");
      }
    } else {
      console.log("username already in chat room");
    }
  };

  return (
    <div className="App">
      <div className="joinChatContainer">
        {!joined ? (
          <>
            <h3>Join A chat room</h3>
            <input
              placeholder="Name.."
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Room id.."
              type="text"
              onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={() => joinRoom()}>Join A Room</button>
          </>
        ) : (
          <>
            <Chat username={username} socket={socket} room={room} />
            <button onClick={() => disconnect()}>Disconnect</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
