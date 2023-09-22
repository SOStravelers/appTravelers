import Link from "next/link";
import Image from "next/image";

function SubServiceCard({ link, icon, name }) {
  return (
    <Link href={link}>
      <div className="text-black flex flex-col items-center justify-center bg-white w-40 h-40 m-2 rounded-xl">
        <div className="w-24 h-24 rounded-full bg-blueBorder relative flex items-center justify-center">
          <Image
            src={"/assets/subservice.png"}
            fill
            className="object-contain ml-1"
          />
        </div>
        <h1 className="text-center text-lg mt-2">{name}</h1>
      </div>
    </Link>
  );
}

export default SubServiceCard;
