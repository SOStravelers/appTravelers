import WorkerCardFavorite from "@/components/utils/cards/WorkerCardFavorite";

export default function Favorites() {
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-28 px-5 md:pl-80">
      <WorkerCardFavorite
        name={"Juan Perez"}
        service={"Barber"}
        score={5}
        link={"/worker/" + 1}
      />
    </div>
  );
}
