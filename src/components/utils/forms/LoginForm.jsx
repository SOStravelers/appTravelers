import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "@/store";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";

import { Field, Form } from "houseform";
import { z } from "zod";
import { toast } from "react-toastify";
import { UserIcon, LockIcon } from "@/constants/icons";
import UserService from "@/services/UserService";

import Cookies from "js-cookie";

function LoginForm() {
  const { setUser, setLoggedIn, service } = useStore();
  const router = useRouter();
  const login = async (values) => {
    try {
      console.log("--login email--");
      const response = await UserService.login(values.email, values.password);
      localStorage.setItem("auth.access_token", response.data.access_token);
      localStorage.setItem("auth.refresh_token", response.data.refresh_token);
      localStorage.setItem("auth.user_id", response.data.user._id);
      localStorage.setItem("auth.user", JSON.stringify(response.data.user));

      Cookies.set("auth.access_token", response.data.access_token);
      Cookies.set("auth.refresh_token", response.data.refresh_token);
      Cookies.set("auth.user_id", response.data.user._id);
      Cookies.set("auth.user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setLoggedIn(true);
      if (service && Object.keys(service).length > 0) {
        router.push(`/summary`);
      } else {
        router.push("/");
      }
    } catch (error) {
      let message;
      if (error?.response?.status === 404)
        message = error?.response?.data?.message;
      else if (error?.response?.status === 400)
        message = error?.response?.data?.message;
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
          <OutlinedButton text="Login" disabled={!isValid} />

          <GoogleButton />
        </form>
      )}
    </Form>
  );
}

export default LoginForm;
