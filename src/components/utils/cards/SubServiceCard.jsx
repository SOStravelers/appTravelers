import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store";

function SubServiceCard({ id, link, icon, name }) {
  const { setService } = useStore();
  const select = () => {
    console.log(id);
    setService({ subServiceId: id });
  };
  return (
    <Link href={link} onClick={select}>
      <div className="text-black flex flex-col items-center justify-center bg-white w-40 h-40 m-2 rounded-xl cursor-pointer">
        <div className="w-24 h-24 rounded-full bg-blueButton relative flex items-center justify-center">
          <Image
            src={"/assets/subservice.png"}
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
