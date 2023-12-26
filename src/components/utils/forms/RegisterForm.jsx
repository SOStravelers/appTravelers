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

import UserService from "@/services/UserService.js";

import Cookies from "js-cookie";
import { useStore } from "@/store";
import { set } from "date-fns";

function RegisterForm() {
  const { setUser, setLoggedIn, service } = useStore();
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

      if (service && Object.keys(service).length > 0) {
        router.push(`/summary`);
      } else {
        router.push("/");
      }
    } catch (error) {
      let message;
      if (error?.response?.status === 409)
        message = error?.response?.data?.message;
      else if (error?.response?.status === 400)
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
                    placeholder="Full Name"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
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
            name="email"
            onBlurValidate={z.string().email("Invalid email")}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder="Email Address"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
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
                    placeholder="Password"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
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
                    placeholder="Confirm Password"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
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
          <Link href="/">
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
              <OutlinedButton text="Register" disabled={!isValid} />
              <GoogleButton />
            </>
          )}
        </form>
      )}
    </Form>
  );
}

export default RegisterForm;
