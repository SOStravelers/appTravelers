import Link from "next/link";
import Image from "next/image";
import { StarIcon, ArrowRightIcon } from "@/constants/icons";

function WorkerCard({
  link,
  name,
  service,
  score,
  showArrow = true,
  onClickSummary,
}) {
  const handleSummary = () => {
    if (onClickSummary) onClickSummary();
  };
  return (
    <div
      className="flex py-4 w-80 rounded-lg justify-around my-2 items-center"
      style={{ boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.15)" }}
    >
      <Link href={link}>
        <div className="flex">
          <div className="w-20 h-20 rounded-xl bg-azul mr-2 relative">
            <Image
              src={"/assets/proovedor.png"}
              fill
              className="object-cover rounded-xl"
            />
          </div>
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
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full bg-azul"
            onClick={handleSummary}
          >
            <ArrowRightIcon className="ml-1" />
          </div>
        </Link>
      ) : (
        <div className="w-10"></div>
      )}
    </div>
  );
}

export default WorkerCard;
