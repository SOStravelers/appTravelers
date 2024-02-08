import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store";
import {
  HairBeardIcon,
  WomanIcon,
  BeardIcon,
  ManIcon,
} from "@/constants/icons";

function SubServiceCard({ id, link, img, price, name, duration, details }) {
  const { setService } = useStore();
  const select = () => {
    setService({
      subServiceId: id,
      price: price,
      nameSubservice: name,
      duration: duration,
      details: details,
    });
  };
  return (
    <Link href={link} onClick={select}>
      <div className="text-black flex flex-col items-center justify-center bg-white w-full h-full m-2 rounded-xl cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-blueButton relative flex items-center justify-center">
          <Image
            src={img ? img : "/assets/subservice.png"}
            width={45}
            height={45}
            alt="subservice"
            className="object-contain ml-1"
          />
        </div>
        <h1 className="text-center text-lg mt-2">{name}</h1>
      </div>
    </Link>
  );
}

export default SubServiceCard;
