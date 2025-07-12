import Link from "next/link";
import { useRouter } from "next/router";
import { Rings } from "react-loader-spinner";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";
import { useState } from "react";
import { Field, Form } from "houseform";
import { z } from "zod";
import { toast } from "react-toastify";
import languageData from "@/language/login.json";
import UserService from "@/services/UserService.js";

import Cookies from "js-cookie";
import { useStore } from "@/store";
import { set } from "date-fns";

function RegisterForm() {
  const { setUser, setLoggedIn, service, setRegister, language } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const register = async (values) => {
    try {
      setLoading(true);
      const response = await UserService.register(
        values.name,
        values.email,
        values.password
      );
      if (response.data.user.type && response.data.user.type != "personal") {
        localStorage.setItem("type", response.data.user.type);
      }
      Cookies.set("auth.access_token", response.data.access_token);
      Cookies.set("auth.refresh_token", response.data.refresh_token);
      Cookies.set("auth.user_id", response.data.user._id);
      setUser(response.data.user);
      setLoggedIn(true);
      console.log(response.data.user);
      const response2 = await UserService.findByEmail(values.email);
      if (response2?.data?.isActive && response2?.data?.isValidate) {
        router.push("/");
      } else if (!response2?.data?.isValidate) {
        const res = await UserService.sendCodeEmail(
          response2.data._id,
          "validate"
        );
        if (res.status === 200) {
          setRegister(true);
          router.push({
            pathname: "/verify-account",
            query: { userId: response2?.data?._id },
          });
        }
      }
    } catch (error) {
      let message;
      if (error?.response?.status == 409)
        message = error?.response?.data?.error;
      else if (error?.response?.status == 400)
        message = error?.response?.data?.result;
      toast.error(message);
    }
    setLoading(false);
  };
  return (
    <Form
      onSubmit={(values) => {
        register(values);
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
            name="name"
            onBlurValidate={z.string().refine((val) => val, {
              message: "Required Field",
            })}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder={languageData.form.fullName[language]}
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  {errors.map((error) => (
                    <p key={error} className="text-errorColor text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              );
            }}
          </Field>
          <Field
            name="email"
            onBlurValidate={z.string().email("Invalid email")}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder={languageData.form.email[language]}
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  {errors.map((error) => (
                    <p key={error} className="text-errorColor text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              );
            }}
          </Field>
          <Field
            name="password"
            onChangeValidate={async (val, form) => {
              if (!val) throw "Required field";
              if (val.length < 6) throw "Minimum 6 characters";
              if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(val))
                throw "Must include both numbers and letters";
              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder={languageData.form.password[language]}
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
                  />
                  {errors.map((error) => (
                    <p key={error} className="text-errorColor text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              );
            }}
          </Field>
          <Field
            listenTo={["password"]}
            name="passwordConfirm"
            onChangeValidate={async (val, form) => {
              if (!val) throw "Required field";
              if (val.length < 6) throw "Minimum 6 characters";
              if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(val))
                throw "Must include both numbers and letters";
              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder={languageData.form.confirmPass[language]}
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
                  />
                  {errors.map((error) => (
                    <p key={error} className="text-errorColor text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              );
            }}
          </Field>
          <Link href="/">
            <p className="text-textColor text-sm mt-1 mb-2 text-right">
              {languageData.form.forgotPass[language]}
            </p>
          </Link>
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
                buttonCenter={true}
                dark="darkLight"
                textSize="text-sm"
                textColor="text-white"
                text={languageData.register.title[language]}
                disabled={!isValid}
              />
              <GoogleButton />
            </>
          )}
        </form>
      )}
    </Form>
  );
}

export default RegisterForm;
