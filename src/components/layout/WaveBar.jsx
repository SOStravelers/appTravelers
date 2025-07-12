import { LogoWhite } from "@/constants/icons";
import Link from "next/link";

function WaveBar() {
  return (
    <div
      className="w-screen flex flex-col justify-center items-center  md:bg-darkBlue md:h-40 object-cover"
      style={{ marginTop: "-35px" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100vw"
        height="100%"
        viewBox="0 0 390 218"
        fill="none"
      >
        <path
          d="M390 -1H350H40H0V39V128V173.45C5.833 173.777 11.667 174.193 17.5 174.731C101.917 182.519 186.333 213.672 270.75 217.567C312.162 219.478 353.571 214.826 390 208.213V128V39V-1Z"
          fill="#001C25"
        />
      </svg>

      <LogoWhite
        className="my-auto absolute"
        height={100}
        width={100}
        color={"white"}
      />
      {/* {process.env.NEXT_PUBLIC_NODE_ENV != "production" && (
        <h1 className="text-white  neon-dark text-xs  text-center  sm:text-base md:text-lg lg:text-lg xl:text-lg">
          {process.env.NEXT_PUBLIC_NODE_ENV == "dev" ||
          process.env.NEXT_PUBLIC_NODE_ENV == "development"
            ? "Dev Version"
            : " Test Version"}
        </h1>
      )} */}
    </div>
  );
}

export default WaveBar;
