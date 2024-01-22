import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import { Rings } from "react-loader-spinner";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";

import { Field, Form } from "houseform";
import { z } from "zod";
import { toast } from "react-toastify";
import { UserIcon, LockIcon } from "@/constants/icons";
import UserService from "@/services/UserService";

import Cookies from "js-cookie";
import { set } from "date-fns";

function LoginForm() {
  const [email, setEmail] = useState("");
  const { setUser, setLoggedIn, service, setWorker } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const login = async (values) => {
    setLoading(true);
    setEmail(values.email);
    try {
      console.log("--login email--");
      const response = await UserService.login(values.email, values.password);
      toast.info("signin", {
        position: toast.POSITION.TOP_RIGHT,
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
        router.push(`/summary`);
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
                  <OutlinedInput
                    placeholder="Email addres"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    icon={UserIcon}
                  />
                  {errors.map((error) => (
                    <p key={error} className="text-red">
                      {error}
                    </p>
                  ))}
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
                  <OutlinedInput
                    placeholder="Password"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
                    icon={LockIcon}
                  />
                  {errors.map((error) => (
                    <p key={error} className="text-red">
                      {error}
                    </p>
                  ))}
                </div>
              );
            }}
          </Field>
          <Link href="/forgot-password">
            <p className="text-blackText mt-1 mb-2 text-right">
              Forgot password?
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
              <OutlinedButton text="Login" disabled={!isValid} />

              <GoogleButton />
            </>
          )}
        </form>
      )}
    </Form>
  );
}

export default LoginForm;
