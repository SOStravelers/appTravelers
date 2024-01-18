import Link from "next/link";
import {
  HairCutIcon,
  MassageIcon,
  TattooIcon,
  YogaIcon,
} from "@/constants/icons";
import { mazzard } from "@/utils/mazzardFont";
import { useStore } from "@/store";
function ServiceCard({ link, icon, name, id }) {
  const { setService } = useStore();
  const select = () => {
    setService({ serviceId: id });
  };
  return (
    <Link href={link} onClick={select}>
      <div className="text-black flex flex-col items-center justify-center mx-3">
        <div className="w-16 h-16 rounded-full bg-blueBorder  items-center justify-center">
          <TattooIcon color="white" />
        </div>
        <h1 className={`text-center mt-2 ${mazzard.className}`}>{name}</h1>
      </div>
    </Link>
  );
}

export default ServiceCard;
