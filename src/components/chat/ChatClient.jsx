import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SendIcon } from "@/constants/icons";
import ChatService from "@/services/ChatService";

const ChatClient = ({
  socket,
  initialMessages,
  idClient,
  idWorker,
  chatId,
}) => {
  const textareaRef = useRef();
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialMessages?.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    // console.log("socket.current", socket.current);

    if (socket.current) {
      // console.log("recibiendo desde a chatContainer comp");
      socket.current.on("msg-recieve", (data) => {
        if (data.chatRoom !== chatId) return;
        setArrivalMessage({ fromSelf: false, message: data.msg });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    console.log("enviando", inputValue);
    // Eliminar los saltos de línea al inicio y al final del mensaje
    const trimmedInputValue = inputValue.replace(/^\n+|\n+$/g, "");
    if (trimmedInputValue.trim() !== "") {
      socket.current.emit("send-msg", {
        from: idClient,
        to: idWorker,
        chatRoom: chatId,
        msg: trimmedInputValue,
      });
      ChatService.createMessage({
        from: idClient,
        to: idWorker,
        chatRoom: chatId,
        message: trimmedInputValue,
      }).then((res) => {
        // console.log(res.data);
        const newMessage = { fromSelf: true, message: trimmedInputValue };
        setMessages([...messages, newMessage]);
      });
      setInputValue("");
      // ref = { textareaRef };
      textareaRef.current.focus();
    }
  };
  const adjustTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSendPredefinedMsg = (event) => {
    const msg = event.target.innerHTML;
    socket.current.emit("send-msg", {
      from: idClient,
      to: idWorker,
      chatRoom: chatId,
      msg: msg,
    });
    ChatService.createMessage({
      from: idClient,
      to: idWorker,
      chatRoom: chatId,
      message: event.target.innerHTML,
    }).then((res) => {
      console.log(res.data);
      const newMessage = { fromSelf: true, message: event.target.innerHTML };
      setMessages([...messages, newMessage]);
    });
  };

  return (
    <div className="bg-white max-w-2xl flex flex-col items-center md:items-start mt-5">
      <div className="chat">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`msg my-1 ${message.fromSelf ? "sent" : "rcvd"}`}
          >
            {message.message.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        ))}
      </div>

      <div
        className="flex flex-col w-full items-center fixed md:px-0 bottom-[0.5rem] py-1 bg-white"
        // style={{
        //   boxShadow: "-2px -1px 10px 14px rgba(255,255,255,0.81)",
        // }}
      >
        <div className="flex w-full overflow-x-auto my-3">
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full py-1 mx-1 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            I&apos;m Here
          </div>
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full  mx-1 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            Where are you?
          </div>
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full  mx-1 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            I&apos;m in the reception
          </div>
          <div
            className="flex justify-center items-center text-white bg-grey rounded-full  mx-1 min-w-[200px] cursor-pointer"
            onClick={handleSendPredefinedMsg}
          >
            Wait a minute
          </div>
        </div>
        <div className="flex items-center w-full pl-2 pr-1 ">
          <textarea
            ref={textareaRef}
            style={{
              border: "2px solid #00A0D5",
              paddingTop: "10px",
              paddingLeft: "7px",
              // padding: "10 20 0 0 ",
              outline: "none",
              height: "35px",
              overflow: "hidden",
              resize: "none",
              lineHeight: "1", // Añade esto
            }}
            className="border border-black rounded-xl w-[98%] sm:w-[60%] "
            value={inputValue}
            onChange={(event) => {
              handleInputChange(event);
              adjustTextAreaHeight();
            }}
            placeholder="Type a message..."
          />
          <SendIcon
            // style={{ transform: "rotate(-20deg)" }}
            className="cursor-pointer ml- h-10 w-10"
            onClick={handleSendClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatClient;
