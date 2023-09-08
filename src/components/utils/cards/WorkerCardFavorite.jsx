import Link from "next/link";
import { StarIcon, FavIconBorder } from "@/constants/icons";

function WorkerCardFavorite({ link, name, service, score, showArrow = true }) {
  return (
    <div
      className="flex py-4 w-80 rounded-lg justify-around my-2 items-center"
      style={{ boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.15)" }}
    >
      <Link href={link}>
        <div className="flex">
          <div className="w-20 h-20 rounded-xl bg-azul mr-2"></div>
          <div className="flex flex-col">
            <h1 className="font-semibold">{name}</h1>
            <p className="text-negroTexto">{service}</p>
            <div className="flex items-center">
              <StarIcon color={"#5B78C7"} className="mr-1" />
              <p className="text-negroTexto">{score}</p>
            </div>
          </div>
        </div>
      </Link>
      {showArrow ? (
        <Link href={"/summary"}>
          <div className="w-10 h-10 flex items-center justify-center">
            <FavIconBorder color={"#5B78C7"} className="ml-1" />
          </div>
        </Link>
      ) : (
        <div className="w-10"></div>
      )}
    </div>
  );
}

export default WorkerCardFavorite;
