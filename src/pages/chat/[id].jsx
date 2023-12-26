import WorkerProfileCardChat from "@/components/utils/cards/WorkerProfileCardChat";
import Chat from "@/components/chat/Chat";
import { useRouter } from "next/router";

export default function PersonalChat() {
  const router = useRouter();
  const { contacto } = router.query;

  console.log(contacto);
  return (
    <div className="bg-white w-screen py-20 px-5 md:pl-80 max-h-screen">
      <WorkerProfileCardChat
        name={"Juan Perez"}
        services={[
          { id: { name: "Facial" } },
          { id: { name: "Corte Cabello" } },
        ]}
        score={5}
      />
      <Chat />
    </div>
  );
}
