import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { LockIcon } from "@/constants/icons";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import { Field, Form } from "houseform";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
function CreatePassForm() {
  const { user, setUser, setLoggedIn } = useStore();
  const router = useRouter();
  const createPass = async (values) => {
    try {
      const id = user._id;
      let token = Cookies.get("auth.access_token");
      const response = await UserService.createPassword(values.password, token);
      if (response.data) {
        // if (response.data.user.type && response.data.user.type != "personal") {
        //   localStorage.setItem("type", response.data.user.type);
        // }
        delete response.data.user.type;
        setUser(response.data.user);
        localStorage.setItem("auth.user", JSON.stringify(response.data.user));
        Cookies.set("auth.user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        toast.success("Password successfully changed.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1800,
        });
        router.push("/personal-details");
      }
    } catch (err) {
      console.log("perooo");
      console.log(err.response.data.message);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        });
      } else {
        toast.error("Internal Server Error. Please try again later.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <Form
      onSubmit={(values) => {
        createPass(values);
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
                    icon={LockIcon}
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
                    icon={LockIcon}
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
          <OutlinedButton
            style={{ marginTop: "25px" }}
            text="Create Password"
            disabled={!isValid}
          />
        </form>
      )}
    </Form>
  );
}

export default CreatePassForm;
