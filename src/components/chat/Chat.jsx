import { useState } from "react";
import { SendIcon } from "@/constants/icons";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      <div class="chat">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`msg ${index % 3 === 0 ? "sent" : "rcvd"}`}
          >
            {message}
          </div>
        ))}
      </div>
      <div
        className="flex items-center fixed w-screen px-5 bg-white bottom-16 pt-3"
        style={{
          boxShadow: "-2px -1px 10px 14px rgba(255,255,255,0.81)",
        }}
      >
        <textarea
          className="border border-black rounded-xl w-full m-h-10 p-2"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />

        <SendIcon
          className="cursor-pointer h-10 w-10"
          onClick={handleSendClick}
        />
      </div>
    </div>
  );
};

export default Chat;
