import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import { useRouter } from "next/router";
import { LockIcon } from "@/constants/icons";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import { Field, Form } from "houseform";
import { toast } from "react-toastify";

function RecoveryPassForm({ user }) {
  const router = useRouter();

  const createPass = async (values) => {
    try {
      const token = user;
      const response = await UserService.createPassword(values.password, token);
      if (response.data) {
        toast.success("Password successfully changed.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1800,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.error, {
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
            text="Change Password"
            disabled={!isValid}
          />
        </form>
      )}
    </Form>
  );
}

export default RecoveryPassForm;
