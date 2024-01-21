import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store";
import { useRouter } from "next/router";

function ServiceCardGrey({ id, link, icon, name, subServices }) {
  const { setService } = useStore();
  const router = useRouter();

  const select = () => {
    setService({ serviceId: id });
    const fromFavorite = localStorage.getItem("fromFavorite");
    if (fromFavorite === true) {
      router.push({
        pathname: link,
        query: { subservices: JSON.stringify(subServices) },
      });
    } else {
      router.push(link);
    }
  };

  return (
    <Link href={link} onClick={select}>
      <div className="text-black flex flex-col items-center justify-center bg-white w-full h-full m-2 rounded-xl cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-darkBlue relative flex items-center justify-center">
          <Image
            src={icon ? icon : "/assets/subservice.png"}
            width={45}
            height={45}
            alt="service"
            className="object-contain ml-1"
          />
        </div>
        <h1 className="text-center text-lg mt-2">{name}</h1>
      </div>
    </Link>
  );
}

export default ServiceCardGrey;
