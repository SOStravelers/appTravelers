import Link from "next/link";
import React from "react";

function SubServiceCard({ link, icon, name }) {
  return (
    <Link href={link}>
      <div className="text-negro flex flex-col items-center justify-center bg-blanco w-40 h-40 m-2 shadow-xl rounded-xl">
        <div className="w-24 h-24 rounded-full bg-azul"></div>
        <h1 className="text-center text-lg mt-2">{name}</h1>
      </div>
    </Link>
  );
}

export default SubServiceCard;
