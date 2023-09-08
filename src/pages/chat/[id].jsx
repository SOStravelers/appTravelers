import WorkerProfileCardChat from "@/components/utils/cards/WorkerProfileCardChat";

export default function PersonalChat() {
  return (
    <div className="bg-white p-5 w-screen h-full">
      <WorkerProfileCardChat name={"Juan Perez"} service={"Barber"} score={5} />
    </div>
  );
}
