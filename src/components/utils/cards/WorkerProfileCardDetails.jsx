import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { PinIcon } from "@/constants/icons";
import SolidButton from "../buttons/SolidButton";
import { random } from "@/lib/utils";

function WorkerProfileCardDetails({ name, services, id, avatar }) {
  const router = useRouter();

  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32 rounded-2xl mr-2">
        <div className="bg-blueBorder w-full h-full rounded-2xl relative">
          <Image
            src={avatar + "?hola=" + random() ?? "/assets/proovedor.png"}
            fill
            alt="nuevo"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <h1 className="font-semibold text-black">{name}</h1>
        </div>
        <p className="text-blackText my-2">
          {services?.map((service) => service.id.name).join(", ")}
        </p>
        <div className="flex items-center">
          <SolidButton
            text="View Profile"
            color="black"
            onClick={() => router.push({ pathname: `/worker/${id}` })}
          />
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCardDetails;
