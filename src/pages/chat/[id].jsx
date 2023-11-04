import WorkerProfileCardChat from "@/components/utils/cards/WorkerProfileCardChat";
import Chat from "@/components/chat/Chat";

export default function PersonalChat() {
  return (
    <div className="bg-white w-screen py-28 px-5 md:pl-80 max-h-screen">
      <WorkerProfileCardChat name={"Juan Perez"} service={"Barber"} score={5} />
      <Chat />
    </div>
  );
}
