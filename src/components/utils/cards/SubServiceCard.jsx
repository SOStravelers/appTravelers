import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store";

function SubServiceCard({ id, link, icon, price, name, duration }) {
  const { setService } = useStore();
  const select = () => {
    setService({
      subServiceId: id,
      price: price,
      nameSubservice: name,
      duration: duration,
    });
  };
  return (
    <Link href={link} onClick={select}>
      <div className="text-black flex flex-col items-center justify-center bg-white w-32 h-32 m-2 rounded-xl cursor-pointer">
        <div className="w-20 h-20 rounded-full bg-blueButton relative flex items-center justify-center">
          <Image
            src={icon?.length > 0 ? icon : "/assets/subservice.png"}
            fill
            alt="perro"
            className="object-contain ml-1"
          />
        </div>
        <h1 className="text-center text-lg mt-2">{name}</h1>
      </div>
    </Link>
  );
}

export default SubServiceCard;
