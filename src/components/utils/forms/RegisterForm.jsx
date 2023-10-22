import Link from "next/link";
import { useRouter } from "next/router";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";

import { Field, Form } from "houseform";
import { z } from "zod";
import { toast } from "react-toastify";

import UserService from "@/services/UserService.js";

import Cookies from "js-cookie";
import { useStore } from "@/store";

function RegisterForm() {
  const { setUser, setLoggedIn, service } = useStore();
  const router = useRouter();

  const register = async (values) => {
    try {
      const response = await UserService.register(
        values.name,
        values.email,
        values.password
      );

      localStorage.setItem("auth.access_token", response.data.access_token);
      localStorage.setItem("auth.refresh_token", response.data.refresh_token);
      localStorage.setItem("auth.user_id", response.data.user._id);
      localStorage.setItem("auth.user", response.data.user);

      Cookies.set("auth.access_token", response.data.access_token);
      Cookies.set("auth.refresh_token", response.data.refresh_token);
      Cookies.set("auth.user_id", response.data.user._id);
      Cookies.set("auth.user", response.data.user);
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
              message: "Campo requerido",
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
              if (form.getFieldValue("password")?.value !== val)
                throw "Passwords don't match";

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
          <OutlinedButton text="Register" disabled={!isValid} />
          <GoogleButton />
        </form>
      )}
    </Form>
  );
}

export default RegisterForm;
