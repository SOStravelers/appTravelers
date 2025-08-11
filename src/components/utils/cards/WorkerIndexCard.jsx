import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { random } from "@/lib/utils";
import { validationImg } from "@/utils/validation";
import { useStore } from "@/store";
import languageBooking from "@/language/bookingDetails.json";
function WorkerIndexCard(theUser) {
  const router = useRouter();
  const { language, service, setService } = useStore();
  const [isImageAccessible, setIsImageAccessible] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(theUser);
    // setUser(user.user);
  }, [user]);

  const setFavorite = (id) => {
    // localStorage.setItem("fromFavorite", true);
    router.push("/worker/" + id);
    return;
  };
  useEffect(() => {
    const checkImage = async () => {
      const validImg = await validationImg(
        user?.user?.img?.imgUrl + "?hola=" + random()
      );
      setIsImageAccessible(validImg);
    };
    checkImage();
  }, [user?.user?.img?.imgUrl]);
  return (
    <div
      onClick={() => setFavorite(user?.user._id)}
      className="text-black flex flex-col bg-white mx-2   rounded-2xl border-r-2 border-blueBorder cursor-pointer "
    >
      <div className="w-full h-44 w-20 rounded-tr-2xl rounded-tl-2xl relative">
        <Image
          src={user?.user?.img?.imgUrl || "/assets/logoSOS.png"}
          fill
          alt="casa"
          className="object-cover rounded-tr-2xl rounded-tl-2xl"
        />
      </div>
      <div className="px-1 flex flex-col sm:px-2">
        <h1 className="font-semibold mt-2 text-sm">
          {user?.user?.personalData?.name?.first || ""}
        </h1>
        <h1 className="font-semibold text-sm">
          {user?.user?.personalData?.name?.last || ""}
        </h1>
        {/* <p className="text-blackText text-sm">
          {formatName(user?.user?.personalData?.name)}
        </p> */}
      </div>
    </div>
  );
}

export default WorkerIndexCard;
