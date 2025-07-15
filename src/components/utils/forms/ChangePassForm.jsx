import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import Link from "next/link";
import SolidButton from "@/components/utils/buttons/SolidButton";
import InputText from "@/components/utils/inputs/InputText";
import { LockIcon } from "@/constants/icons";
import { FaLock } from "react-icons/fa";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import Cookies from "js-cookie";
import { useStore } from "@/store";
import { Field, Form } from "houseform";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
function ChangePassForm() {
  const router = useRouter();
  const { user, setUser, setLoggedIn, isWorker } = useStore();

  const changePass = async (values) => {
    try {
      const response = await UserService.changePassword(
        values.currentPassword,
        values.password
      );
      if (response.data) {
        // if (response.data.user.type && response.data.user.type != "personal") {
        //   localStorage.setItem("type", response.data.user.type);
        // }
        delete response.data.user.type;
        setUser(response.data.user);
        localStorage.setItem("auth.user", JSON.stringify(response.data.user));
        Cookies.set("auth.user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        toast.success(isWorker ? "Senha alterada" : "Password changed", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1800,
        });
        router.push("/personal-details");
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
  const goToforgot = () => {
    router.push("/forgot-password");
  };
  return (
    <Form
      onSubmit={(values) => {
        changePass(values);
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
              if (!val) throw isWorker ? "Campo obrigatório" : "Required field";
              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <InputText
                    placeholder={isWorker ? "Senha atual" : "Current password"}
                    value={value}
                    icon={FaLock}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
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
            onChangeValidate={async (val, form) => {
              if (!val) throw "Required field";
              if (val.length < 6)
                throw isWorker ? "Mínimo 6 caracteres" : "Minimum 6 characters";
              if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(val))
                throw isWorker
                  ? "Deve incluir números e letras"
                  : "Must include both numbers and letters";
              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <InputText
                    placeholder={isWorker ? "Nova senha" : "New password"}
                    value={value}
                    icon={FaLock}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
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
            listenTo={["password"]}
            name="passwordConfirm"
            onChangeValidate={async (val, form) => {
              if (!val) throw "Required field";

              if (val.length < 6)
                throw isWorker ? "Mínimo 6 caracteres" : "Minimum 6 characters";
              if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(val))
                throw isWorker
                  ? "Deve incluir números e letras"
                  : "Must include both numbers and letters";
              if (form.getFieldValue("password")?.value !== val)
                throw isWorker
                  ? "Senhas não coincidem"
                  : "Passwords do not match";

              return true;
            }}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <InputText
                    placeholder={
                      isWorker ? "Confirmar nova senha" : "Confirm new password"
                    }
                    value={value}
                    icon={FaLock}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    type="password"
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
              Forgot password?
            </button>
          </div>

          <OutlinedButton
            buttonCenter={true}
            dark="darkLight"
            textSize="text-sm"
            margin="mt-5"
            textColor="text-white"
            text={isWorker ? "Salvar alterações" : "Save Changes"}
            disabled={!isValid}
          />
        </form>
      )}
    </Form>
  );
}

export default ChangePassForm;
