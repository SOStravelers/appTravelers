import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import { Rings } from "react-loader-spinner";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";
import { FaUser, FaLock } from "react-icons/fa";
import { Field, Form } from "houseform";
import { z } from "zod";
import { toast } from "react-toastify";
import { UserIcon, LockIcon } from "@/constants/icons";
import UserService from "@/services/UserService";
import languageData from "@/language/login.json";
import Cookies from "js-cookie";
import { set } from "date-fns";
import InputText from "@/components/utils/inputs/InputText";

function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const { setUser, setLoggedIn, service, setWorker, language } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const login = async (values) => {
    setLoading(true);
    setEmail(values.email);
    try {
      console.log("--login email--");
      const response = await UserService.login(values.email, values.password);
      toast.info("signin", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1500,
      });
      Cookies.set("auth.access_token", response.data.access_token);
      Cookies.set("auth.refresh_token", response.data.refresh_token);
      Cookies.set("auth.user_id", response.data.user._id);
      setUser(response.data.user);
      setLoggedIn(true);
      console.log("vamos aqui->");
      if (response.data.user.type == "worker") {
        localStorage.setItem("type", response.data.user.type);
        delete response.data.user.type;
        setWorker(true);
        console.log("vamos al home worker");
        router.push("/worker/home");
        return;
      } else if (service && Object.keys(service).length > 0) {
        setLoading(false);
        console.log("calabaza", localStorage.getItem("fromCustomSummary"));
        if (localStorage.getItem("fromCustomSummary") == true) {
          const url = localStorage.getItem("fullUrl");
          localStorage.setItem("fromCustomSummary", false);
          router.push(url);
        } else {
          router.push(`/summary`);
        }
      } else {
        const response = await UserService.findByEmail(values.email);
        if (response?.data?.isActive && response?.data?.isValidate) {
          setLoading(false);
          router.push("/");
          return;
        } else if (!response?.data?.isValidate) {
          const res = await UserService.sendCodeEmail(
            response.data._id,
            "validate"
          );
          if (res.status === 200) {
            router.push({
              pathname: "/verify-account",
              query: { userId: response?.data?._id },
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      let message;
      if (error?.response?.status === 404)
        message = error?.response?.data?.error;
      else if (error?.response?.status === 400) {
        console.log("400");
        try {
          const response = await UserService.findByEmail(values.email);
          console.log("respuesta", response);
          if (response?.data?.isActive && response?.data?.isValidate) {
            const res = await UserService.sendCodeEmail(
              response.data._id,
              "createPass"
            );
            console.log(res);
            if (res.status === 200) {
              router.push({
                pathname: "/validate-email",
                query: { userId: response?.data?._id },
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else if (error?.response?.status === 401) {
        message = error?.response?.data?.error;
      }
      toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1500,
      });
    }
  };

  const goToforgot = () => {
    router.push("/forgot-password");
  };

  return (
    <Form
      onSubmit={(values) => {
        login(values);
      }}
    >
      {({ isValid, submit }) => (
        <form
          className="w-full flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field
            name="email"
            onBlurValidate={z.string().email("Invalid email")}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <InputText
                    type="text"
                    icon={FaUser}
                    value={value}
                    noBorder
                    marginY="mb-1"
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    placeholder={languageData.form.email[language]}
                    className="w-full"
                  />

                  {errors.length > 0 ? (
                    errors.map((error) => (
                      <p key={error} className="text-errorColor text-xs mt-1">
                        {error}
                      </p>
                    ))
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              );
            }}
          </Field>
          <Field
            name="password"
            onChangeValidate={z.string().refine((val) => val, {
              message: "Required field",
            })}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <InputText
                    type="password"
                    icon={FaLock}
                    noBorder
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    placeholder={languageData.form.password[language]}
                    className="w-full"
                  />
                  {errors.length > 0 ? (
                    errors.map((error) => (
                      <p key={error} className="text-errorColor text-xs mt-1">
                        {error}
                      </p>
                    ))
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              );
            }}
          </Field>
          <div className="flex justify-end w-full">
            <button
              type="button"
              className="bg-transparent border-none text-textColor text-sm mt-1 mb-2 cursor-pointer hover:underline"
              onClick={() => goToforgot()}
            >
              {languageData.form.forgotPass[language]}
            </button>
          </div>

          {loading ? (
            <div className="max-w-lg flex flex-col items-center justify-center">
              <Rings
                width={100}
                height={100}
                color="#00A0D5"
                ariaLabel="infinity-spin-loading"
              />
            </div>
          ) : (
            <>
              <OutlinedButton
                text={languageData.form.emailButton[language]}
                px={0}
                py={2}
                dark="darkLight"
                textSize="text-xs"
                margin="mb-3"
                textColor="text-white"
                disabled={!isValid}
                buttonCenter={true}
              />

              <GoogleButton dark="darkLight" />
            </>
          )}
        </form>
      )}
    </Form>
  );
}

export default LoginForm;
