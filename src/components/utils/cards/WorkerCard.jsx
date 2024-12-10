import Link from "next/link";
import Image from "next/image";
import { StarIcon, ArrowRightIcon } from "@/constants/icons";
import { useState, useEffect } from "react";

function WorkerCard({
  link,
  name,
  img,
  service,
  isSubservice = false,
  score,
  showArrow = true,
  multiple = false,
  onClickSummary,
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleSummary = () => {
    if (onClickSummary) {
      console.log("wenaza");
      onClickSummary();
    }
  };
  function truncate(str, num) {
    if (!str) return "";
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }
  return (
    <div
      onClick={handleSummary}
      className="flex justify-between items-center border-b-2 border-blueBorder rounded-2xl my-2 max-w-lg"
    >
      <div className="flex">
        <div
          className={`${
            isSubservice ? "w-60" : "w-20"
          } h-20 rounded-xl mr-2 ml-3 relative`}
        >
          <Link href={link}>
            {img && (
              <Image
                onClick={(e) => e.stopPropagation()}
                src={img}
                alt="workerImg"
                fill
                className="object-cover rounded-xl"
              />
            )}
          </Link>
        </div>
        <Link href={link}>
          <div className="flex flex-col">
            <h1 className="font-semibold">
              {width < 420 ? truncate(name, 20) : name}
            </h1>
            <p className="text-blackText text-xs">
              {width < 420 ? truncate(service, 26) : service}
            </p>
            <div className="flex items-center">
              <StarIcon color={"#00A0D5"} className="mr-1" />
              <p className="text-blackText">{score}</p>
            </div>
          </div>
        </Link>
      </div>

      <Link href={multiple ? link : "/summary"} className="h-full">
        <div className="w-8 h-24 flex items-center justify-center bg-blueBorder rounded-r-2xl cursor-pointer">
          <ArrowRightIcon className="ml-1" />
        </div>
      </Link>
    </div>
  );
}

export default WorkerCard;
