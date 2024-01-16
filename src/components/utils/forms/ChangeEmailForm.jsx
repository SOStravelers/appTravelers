import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import Link from "next/link";
import SolidButton from "@/components/utils/buttons/SolidButton";
import { LockIcon, MailIcon } from "@/constants/icons";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import { Field, Form } from "houseform";
import { toast } from "react-toastify";
function ChangeEmailForm({ setEmail, setValidatingMail, setId }) {
  const { user, setUserId, setUser, setLoggedIn } = useStore();

  const changeEmail = async (values) => {
    try {
      const response = await UserService.login(
        user.email,
        values.currentPassword
      );
      console.log(response);
      if (response.status === 200) {
        console.log(response);
        const id = response.data.user._id;
        verifyEmail(values.email, id);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.error, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        });
      }
    }
  };

  const verifyEmail = async (newEmail, id) => {
    try {
      console.log("enviando codigoss");
      const responseValidation = await UserService.sendCodeEmail(
        user._id,
        "validate",
        newEmail
      );
      console.log("perro");
      if (responseValidation.status === 200) {
        console.log(responseValidation);
        setValidatingMail(true);
        setId(id);
        setEmail(newEmail);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <Form
      onSubmit={(values) => {
        changeEmail(values);
      }}
    >
      {({ isValid, submit }) => (
        <form
          className="w-full flex flex-col max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field
            name="currentPassword"
            onChangeValidate={async (val, form) => {
              if (!val) throw "Required field";
              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder="Current password"
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
            name="email"
            onChangeValidate={async (val, form) => {
              if (!val) throw "Required field";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
                throw "Invalid email format";
              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder="New email"
                    value={value}
                    icon={MailIcon}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="email"
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
            listenTo={["email"]}
            name="emailConfirm"
            onChangeValidate={async (val, form) => {
              if (!val) throw "Required field";
              if (val.length < 6) throw "Minimum 6 characters";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
                throw "Invalid email format";
              if (form.getFieldValue("email")?.value !== val)
                throw "Emails don't match";
              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder="Confirm new email"
                    value={value}
                    icon={MailIcon}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="email"
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
            text="Change Email"
            disabled={!isValid}
            type="submit"
          />
        </form>
      )}
    </Form>
  );
}

export default ChangeEmailForm;
