import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SelectCard from "@/components/utils/cards/SelectCard";
import OptionCard from "@/components/utils/cards/OptionCard";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import ChangeEmailForm from "@/components/utils/forms/ChangeEmailForm";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { toast } from "react-toastify";
import { UserIcon, MailIcon, HouseIcon, LockIcon } from "@/constants/icons";
import { useStore } from "@/store";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";

export default function PersonalDetails() {
  const router = useRouter();
  const { user, setUser, setLoggedIn } = useStore();
  const [name, setName] = useState(null);
  const [nameTrun, setNameTrun] = useState(null);
  const [emailTrun, setEmailTrun] = useState(null);
  const [nameInput, setNameInput] = useState(false);
  const [emailInput, setEmailInput] = useState(false);
  const [email, setEmail] = useState(false);
  const [save, setSave] = useState(false);
  useEffect(() => {
    document.title = "Personal Details | SOS Travelers";
  }, []);
  useEffect(() => {
    if (user) {
      const name =
        capitalizeFirstLetter(user?.personalData?.name?.first) +
        " " +
        capitalizeFirstLetter(user?.personalData?.name?.last);
      setName(name);
      setNameTrun(truncarNumero(name));
      setEmail(user.email);
      setEmailTrun(truncarNumero(user.email));
    }
  }, [user]);
  function separarNombre(nombre) {
    const nombreSinEspacios = nombre.trim();
    const indicePrimerEspacio = nombreSinEspacios.indexOf(" ");
    const primerNombre = nombreSinEspacios.slice(0, indicePrimerEspacio);
    const segundoNombre = nombreSinEspacios.slice(indicePrimerEspacio + 1);
    return [primerNombre, segundoNombre];
  }
  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  const truncarNumero = (word) => {
    const truncatedValue = word.length > 17 ? word.slice(0, 17) + "..." : word;
    return truncatedValue;
  };

  const handleNameClick = () => {
    setNameInput(true);
    setEmailInput(false);
    setSave(true);
  };
  const handleEmailClick = () => {
    router.push("/change-email");
  };

  function setTheName(name) {
    setName(name);
    setNameTrun(truncarNumero(name));
  }

  const saveAll = async () => {
    const newUser = { ...user };
    console.log("el name", name);
    const arrayName = separarNombre(name);
    if (nameInput == true) {
      try {
        newUser.personalData.name.first = capitalizeFirstLetter(arrayName[0]);
        newUser.personalData.name.last = capitalizeFirstLetter(arrayName[1]);
        const response = await UserService.updateUser(newUser);

        if (response.data) {
          localStorage.setItem("auth.user", JSON.stringify(response.data.user));
          Cookies.set("auth.user", JSON.stringify(response.data.user));
          toast.info("Saved.", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1500,
          });
        }
      } catch (err) {
        toast.error("Internal Server Error. Please try again later.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1800,
        });
      }
    }
    setNameInput(false);
    setEmailInput(false);
    setSave(false);
  };

  return (
    <div className="flex flex-col justify-center py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      {!nameInput ? (
        <SelectCard
          title="Name"
          onClick={handleNameClick}
          icon={UserIcon}
          edit={true}
          subtitle={nameTrun}
        />
      ) : (
        <OutlinedInput
          placeholder="Name"
          icon={UserIcon}
          value={name}
          // onBlur={onBlur}
          onChange={(e) => setTheName(e.target.value)}
        />
      )}
      <SelectCard
        title="Email"
        onClick={handleEmailClick}
        icon={MailIcon}
        edit={true}
        subtitle={emailTrun}
      />

      {/* <SelectCard
        title="Address"
        icon={HouseIcon}
        edit={true}
        subtitle="Avenida Atlántica 1234, Copacabana, Rio de Janeiro, Brazil"
      /> */}
      {user && user.security && user.security.hasPassword ? (
        // Este componente se mostrará si el usuario está autenticado
        <OptionCard
          title="Change Password"
          icon={LockIcon}
          onClick={() => router.push("/change-password")}
        />
      ) : (
        // Este componente se mostrará si el usuario no está autenticado
        <OptionCard
          title="Create Password"
          icon={LockIcon}
          onClick={() => router.push("/create-password")}
        />
      )}
      {save && <OutlinedButton text="Save Changes" onClick={saveAll} />}
    </div>
  );
}
