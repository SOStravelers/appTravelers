import { useState, useEffect, useRef } from "react";
import { SendIcon } from "@/constants/icons";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="bg-white h-full w-full flex flex-col items-center md:items-start mt-5 px-3">
      <div className="chat">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`msg ${index % 3 === 0 ? "sent" : "rcvd"}`}
          >
            {message}
          </div>
        ))}
      </div>
      <div
        className="flex items-center fixed w-full md:w-[78%] px-5 bottom-[0.5rem] py-2 bg-white"
        style={{
          boxShadow: "-2px -1px 10px 14px rgba(255,255,255,0.81)",
        }}
      >
        <textarea
          className="border border-black rounded-xl w-full m-h-6 p-2"
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
