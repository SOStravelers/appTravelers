import Link from "next/link";
import RegisterForm from "@/components/utils/forms/RegisterForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";

export default function Registro() {
  const { setUser, setLoggedIn, service } = useStore();
  const router = useRouter();
  useEffect(() => {
    document.title = "Register - SOS Travelers";
    obtenerInformacionUsuario();
  }, []);
  async function obtenerInformacionUsuario() {
    let storageUser = localStorage.getItem("auth.user");
    if (storageUser && Object.keys(storageUser).length > 0) {
      setUser(storageUser);
      setLoggedIn(true);
    }
    try {
      console.log("google search");
      const result = await fetch("/api/getUserInfo");
      if (result.ok) {
        localStorage.setItem("auth.google", true);
        const userInfo = await result.json();
        const response = await UserService.loginGoogle(
          userInfo.name,
          userInfo.email,
          userInfo.image
        );
        if (response) {
          console.log("la respuestaaaa", response.data);
          // if (
          //   response.data.user.type &&
          //   response.data.user.type != "personal"
          // ) {
          //   localStorage.setItem("type", response.data.user.type);
          // }
          delete response.data.user.type;
          localStorage.setItem("auth.access_token", response.data.access_token);
          localStorage.setItem(
            "auth.refresh_token",
            response.data.refresh_token
          );
          localStorage.setItem("auth.user_id", response.data.user._id);
          localStorage.setItem("auth.user", JSON.stringify(response.data.user));
          Cookies.set("auth.access_token", response.data.access_token);

          Cookies.set("auth.refresh_token", response.data.refresh_token);
          Cookies.set("auth.user_id", response.data.user._id);
          setUser(response.data.user);
          setLoggedIn(true);
          if (service && Object.keys(service).length > 0)
            router.push(`/summary`);
          else router.push("/");
        }
      } else {
        setLoggedIn(false);
        //console.error('Error al obtener la información del usuario:', response.statusText);
      }
    } catch (error) {
      //console.error("Error al obtener la información del usuario:", error);
    }
  }
  return (
    <div className="bg-white w-full minh-screen flex flex-col md:items-center px-10">
      <h1 className="text-blackText font-bold text-2xl py-5">REGISTER</h1>
      <h2 className="text-blackText pb-5">Fill the following details</h2>
      <div className="w-full md:w-80">
        <RegisterForm />
      </div>
      <div className="flex flex-col items-center justify-center mt-5">
        <p className="text-blackText">
          You have an account?
          <Link className="text-black font-semibold ml-2" href={"/login"}>
            Login
          </Link>{" "}
        </p>
        <p className="text-xs mt-5">
          By joining, you agree to our{" "}
          <Link href={"terms-of-service"} className="font-bold text-blackText">
            Terms of Service &nbsp;
          </Link>
          and our{" "}
          <Link href={"use-policy"} className="font-bold text-blackText">
            Use Policy.
          </Link>
        </p>
        <Link href="/">
          <p className="text-black font-bold my-5">Skip For Now</p>
        </Link>
      </div>
    </div>
  );
}
