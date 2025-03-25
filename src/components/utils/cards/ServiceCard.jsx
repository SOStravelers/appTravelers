import Link from "next/link";
import Image from "next/image";
import {
  HairCutIcon,
  MassageIcon,
  TattooIcon,
  YogaIcon,
} from "@/constants/icons";
import { mazzard } from "@/utils/mazzardFont";
import { useStore } from "@/store";
function ServiceCard({ link, icon, name, id, img }) {
  const { setService } = useStore();
  const select = () => {
    setService({ serviceId: id, serviceName: name });
  };
  //comentario
  const numberImg = (img) => {
    if (img.includes("experience")) {
      return 450;
    } else {
      return 30;
    }
  };
  return (
    <Link href={link} onClick={select}>
      <div className="text-black flex flex-col items-center justify-center mx-2">
        {/* <TattooIcon color="white" /> */}
        <div className="w-14 h-14 rounded-full bg-blueBorder flex items-center justify-center">
          {img && (
            <Image
              src={img}
              alt="workerImg"
              width={numberImg(img)}
              height={numberImg(img)}
              className="object-cover rounded-xl"
            />
          )}
        </div>
        <h1 className={`text-center mt-2 text-sm ${mazzard.className}`}>
          {name}
        </h1>
      </div>
    </Link>
  );
}

export default ServiceCard;
