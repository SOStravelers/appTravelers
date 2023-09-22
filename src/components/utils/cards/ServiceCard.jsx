import Link from "next/link";
import { HairCutIcon } from "@/constants/icons";
import { mazzard } from "@/utils/mazzardFont";

function ServiceCard({ link, icon, name }) {
  return (
    <Link href={link}>
      <div className="text-black flex flex-col items-center justify-center bg-white w-28 h-28 mx-2 rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-blueBorder flex items-center justify-center">
          <HairCutIcon />
        </div>
        <h1 className={`text-center mt-2 ${mazzard.className}`}>{name}</h1>
      </div>
    </Link>
  );
}

export default ServiceCard;
