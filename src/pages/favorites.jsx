import WorkerCardFavorite from "@/components/utils/cards/WorkerCardFavorite";

export default function Favorites() {
  return (
    <div className="bg-blanco h-full w-screen flex flex-col items-center py-10 px-5">
      <WorkerCardFavorite
        name={"Juan Perez"}
        service={"Barber"}
        score={5}
        link={"/worker/" + 1}
      />
    </div>
  );
}
