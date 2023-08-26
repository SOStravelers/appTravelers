import Image from "next/image";
import Logo from "@/assets/logo.png";

function WaveBar() {
  return (
    <div className="w-screen flex flex-col justify-center items-center bg-blanco">
      <div className="w-screen h-20 bg-azul"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="90"
        viewBox="0 0 390 90"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-489 46.7308L-446.792 50.625C-404.583 54.5193 -320.167 62.3077 -235.75 58.4135C-151.333 54.5193 -66.9167 38.9423 17.5 46.7308C101.917 54.5193 186.333 85.6731 270.75 89.5674C355.167 93.4616 439.583 70.0962 481.792 58.4135L524 46.7308V0H481.792C439.583 0 355.167 0 270.75 0C186.333 0 101.917 0 17.5 0C-66.9167 0 -151.333 0 -235.75 0C-320.167 0 -404.583 0 -446.792 0H-489V46.7308Z"
          fill="#5B78C7"
        />
      </svg>
      <Image className="my-auto absolute" src={Logo} alt="logo" />
    </div>
  );
}

export default WaveBar;
