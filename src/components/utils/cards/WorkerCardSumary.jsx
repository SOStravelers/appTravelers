import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { StarIcon, ChangeIcon } from "@/constants/icons";
import { useState, useEffect } from "react";

function WorkerCardSumary({
  link,
  name,
  service,
  score,
  img,
  showEdit = true,
}) {
  const router = useRouter();
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
  const handleEditWorker = () => {
    const service = JSON.parse(localStorage.getItem("service"));
    localStorage.setItem("editing", true);
    router.push(`/workers-found/${service.service.hostelId}`);
  };
  function truncate(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  return (
    <div className="flex py-4 w-full max-w-lg rounded-lg justify-between my-2 items-center">
      <div className="flex">
        <div className="w-16 h-16 rounded-xl  mr-2 relative">
          <Link href={link}>
            {img ? (
              <Image
                src={img}
                fill
                alt="imagenWorker"
                className="object-cover rounded-xl"
              />
            ) : null}
          </Link>
        </div>
        <div className="flex mt-2 flex-col">
          <h1 className="font-semibold">{name}</h1>
          <p className="text-blackText text-sm">
            {width < 420 ? truncate(service, 26) : service}
          </p>
          {/* <div className="flex items-center">
            <StarIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText">{score}</p>
          </div> */}
        </div>
      </div>

      {showEdit && (
        <div
          className="w-8 h-20 flex items-center justify-centerrounded-r-2xl cursor-pointer"
          onClick={handleEditWorker}
        >
          <ChangeIcon className="ml-1" />
        </div>
      )}
    </div>
  );
}

export default WorkerCardSumary;
