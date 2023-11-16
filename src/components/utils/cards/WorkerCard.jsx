import Link from "next/link";
import Image from "next/image";
import { StarIcon, ArrowRightIcon } from "@/constants/icons";

function WorkerCard({
  link,
  name,
  img,
  service,
  score,
  showArrow = true,
  onClickSummary,
}) {
  const handleSummary = () => {
    if (onClickSummary) onClickSummary();
  };
  return (
    <div className="flex justify-between items-center border-b-2 border-blueBorder rounded-2xl my-2 max-w-lg">
      <div className="flex">
        <div className="w-20 h-20 rounded-xl bg-lightBlue mr-2 ml-3 relative">
          <Link href={link}>
            {img && (
              <Image
                src={img}
                alt="gato"
                fill
                className="object-cover rounded-xl"
              />
            )}
          </Link>
        </div>
        <div className="flex flex-col" onClick={handleSummary}>
          <h1 className="font-semibold">{name}</h1>
          <p className="text-blackText">{service}</p>
          <div className="flex items-center">
            <StarIcon color={"#1CDAE5"} className="mr-1" />
            <p className="text-blackText">{score}</p>
          </div>
        </div>
      </div>
      {showArrow ? (
        <Link href={"/summary"} className="h-full">
          <div
            className="w-8 h-24 flex items-center justify-center bg-blueBorder rounded-r-2xl cursor-pointer"
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
