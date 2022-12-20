import React, { useEffect, useRef, useState } from "react";
const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};
const Chat = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState(new Set());
  // const [show, setShow] = useState(false);

  const sendMessage = async () => {
    const date = new Date(Date.now());
    if (message !== "") {
      const messageData = {
        room: room,
        user: username,
        content: message,
        time: date.getHours() + ":" + date.getMinutes(),
        timestamp: date.getTime(),
      };
      console.log(messageData);
      await socket.emit("send_message", messageData);
      setMessageList((prevList) => new Set([...prevList, messageData]));
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((prevList) => new Set([...prevList, data]));
    });
  }, [socket]);
  return (
    <div className="chat-window">
      <div
        className="chat-header"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <p>{`Chat Room Number: ${room}`}</p>
      </div>
      <div className="chat-body">
        {Array.from(messageList).map((msg) => {
          return (
            <div
              key={msg.timestamp}
              className="message"
              id={username === msg.user ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{`At: ${msg.time}, `}</p>
                  <p id="author">{`From: ${msg.user}`}</p>
                </div>
              </div>
            </div>
          );
        })}
        <AlwaysScrollToBottom />
      </div>
      <div className="chat-footer">
        <input
          type={"text"}
          placeholder="Hey.."
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>send &#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
