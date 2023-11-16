import Image from "next/image";

function RecomendationCard() {
  return (
    <div className="text-black flex flex-col bg-white w-40 h-60 mx-2 rounded-2xl border-r-2 border-blueBorder">
      <div className="w-full h-40 rounded-tr-2xl rounded-tl-2xl relative">
        <Image
          src={"/assets/service.png"}
          fill
          alt="casa"
          className="object-cover rounded-tr-2xl rounded-tl-2xl"
        />
      </div>
      <div className="px-1 sm:px-2">
        <h1 className="font-semibold mt-2">Hair + Bear Cut</h1>
        <p className="text-blackText text-sm">Emmanuel Baroski</p>
      </div>
    </div>
  );
}

export default RecomendationCard;
