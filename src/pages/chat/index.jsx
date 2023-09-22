import WorkerCardChat from "@/components/utils/cards/WorkerCardChat";

export default function Chat() {
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center py-10 px-5">
      <WorkerCardChat
        name={"Juan Perez"}
        service={"Barber"}
        score={5}
        link={"/chat/" + 1}
      />
    </div>
  );
}
