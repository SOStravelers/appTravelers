import { useState, useEffect } from "react";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";
import ChatService from "@/services/ChatService";
import { useStore } from "@/store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ChatPicture } from "@/constants/icons";

export default function Chat() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal } = store;
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  var user = Cookies.get("auth.user_id");

  useEffect(() => {
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => {
    document.title = "My chats | SOS Travelers";
    if (loginModal) {
      console.log("entrando");
      setOpen(false);
      setLoginModal(false);
      // router.push("/");
    }
    if (user) {
      getUsersforChat();
      setChats([
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/chat/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/chat/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/chat/1",
        },
      ]);
    } else {
      setOpen(true);
    }
  }, [loginModal]);

  const getUsersforChat = async () => {
    const response = await ChatService.getAllUsers();
    if (response) {
      console.log(response.data.docs);
    }
    setContacts(response.data.docs);
  };

  const handleGoToChat = (contact) => {
    router.push({
      pathname: `/chat/${contact._id}`,
      query: {
        name: `${contact?.personalData?.name?.first} ${
          contact?.personalData?.name?.last ?? ""
        }`,
        avatar:
          contact.img.imgUrl === ""
            ? "/assets/proovedor.png"
            : contact.img.imgUrl,
        score: contact.rating,
        services: contact.businessData?.services,
      },
    });
  };
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-20 px-3 md:pl-80">
      {contacts?.length > 0 ? (
        contacts.map((contact, index) => (
          <WorkerCardChat
            key={index}
            name={`${contact?.personalData?.name?.first} ${
              contact?.personalData?.name?.last ?? ""
            }`}
            service={""}
            img={
              contact.img.imgUrl === ""
                ? "/assets/proovedor.png"
                : contact.img.imgUrl
            }
            score={contact.rating}
            onClick={() => handleGoToChat(contact)}
          />
        ))
      ) : (
        <div className="text-xl my-3 flex flex-col items-center justify-center px-3 md:pl-40">
          <p className="text-center text-greyText max-w-lg lg:my-4 xl:my-4">
            No chats yet
          </p>
          <ChatPicture />
        </div>
      )}

      {!user && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
