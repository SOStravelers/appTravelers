import Link from "next/link";
import { HairCutIcon } from "@/constants/icons";

function ServiceCard({ link, icon, name }) {
  return (
    <Link href={link}>
      <div className="text-negro flex flex-col items-center justify-center bg-blanco w-28 h-28 mx-2 shadow-xl rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-azul flex items-center justify-center">
          <HairCutIcon />
        </div>
        <h1 className="text-center mt-2">{name}</h1>
      </div>
    </Link>
  );
}

export default ServiceCard;
