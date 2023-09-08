import Link from "next/link";
import { useRouter } from "next/router";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";

import { Field, Form } from "houseform";
import { z } from "zod";
import { toast } from "react-toastify";

import UserService from "@/services/UserService";

import Cookies from "js-cookie";
import { useStore } from "@/store";

function LoginForm() {
  const { setUser, setLoggedIn } = useStore();
  const router = useRouter();

  const login = async (values) => {
    try {
      const response = await UserService.login(values.email, values.password);

      localStorage.setItem("auth.access_token", response.data.access_token);
      localStorage.setItem("auth.refresh_token", response.data.refresh_token);
      localStorage.setItem("auth.user_id", response.data.user._id);

      Cookies.set("auth.access_token", response.data.access_token);
      Cookies.set("auth.refresh_token", response.data.refresh_token);
      Cookies.set("auth.user_id", response.data.user._id);

      setUser(response.data.user);
      setLoggedIn(true);
      
      router.push("/");
    } catch (error) {
      console.error(error)
      let message;
      if (error?.response?.status === 404)
        message = error?.response?.data?.message;
      else if (error?.response?.status === 400)
        message = error?.response?.data?.result;
      else if (error?.response?.status === 401)
        message = error?.response?.data?.message;
      toast.error(message);
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
                  />
                  {errors.map((error) => (
                    <p key={error} className="text-error">
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
                    <p key={error} className="text-error">
                      {error}
                    </p>
                  ))}
                </div>
              );
            }}
          </Field>
          <Link href="/register">
            <p className="text-negroTexto font-bold my-5 text-right">
              Forgot password?
            </p>
          </Link>
          <SolidButton text="Login" disabled={!isValid} />
        </form>
      )}
    </Form>
  );
}

export default LoginForm;
