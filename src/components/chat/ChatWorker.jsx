import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SendIcon } from "@/constants/icons";
import ChatService from "@/services/ChatService";

const ChatWorker = ({ socket, initialMessages }) => {
  const router = useRouter();
  const { idWorker, idClient } = router.query;
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialMessages?.length > 0) {
      console.log(initialMessages);
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (socket?.current) {
      console.log("recibiendo desde a chatContainer comp");
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({ fromSelf: false, message: data.msg });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    if (inputValue.trim() !== "") {
      socket.current.emit("send-msg", {
        from: idWorker,
        to: idClient,
        inputValue,
      });
      ChatService.createMessage({
        from: idWorker,
        to: idClient,
        message: inputValue,
      }).then((res) => {
        console.log(res.data);
        const newMessage = { fromSelf: true, message: inputValue };
        setMessages([...messages, newMessage]);
      });
      setInputValue("");
    }
  };

  const handleSendPredefinedMsg = (event) => {
    const msg = event.target.innerHTML;
    socket.current.emit("send-msg", {
      from: idWorker,
      to: idClient,
      msg,
    });
    ChatService.createMessage({
      from: idWorker,
      to: idClient,
      message: event.target.innerHTML,
    }).then((res) => {
      console.log(res.data);
      const newMessage = { fromSelf: true, message: event.target.innerHTML };
      setMessages([...messages, newMessage]);
    });
  };

  return (
    <div className="bg-white h-full w-full flex flex-col items-center md:items-start mt-5">
      <div className="chat">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`msg my-1 ${message.fromSelf ? "sent" : "rcvd"}`}
          >
            {message.message}
          </div>
        ))}
      </div>

      <div
        className="flex flex-col items-center fixed w-full md:w-[78%] md:px-0 px-5 bottom-[0.5rem] py-1 bg-white"
        style={{
          boxShadow: "-2px -1px 10px 14px rgba(255,255,255,0.81)",
        }}
      >
        <div className="flex md:w-[80vw] w-[95vw] overflow-x-auto py-3">
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full p-1 mx-2 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            Mensaje predefinido
          </div>
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full p-1 mx-2 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            Mensaje predefinido
          </div>
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full p-1 mx-2 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            Mensaje predefinido
          </div>
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full p-1 mx-2 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            Mensaje predefinido
          </div>
        </div>
        <div className="flex items-center w-full">
          <textarea
            className="border border-black rounded-xl w-[85%] min-h-4 p-2"
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
    </div>
  );
};

export default ChatWorker;
