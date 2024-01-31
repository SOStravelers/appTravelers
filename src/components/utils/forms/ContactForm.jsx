import { useRouter } from "next/router";
import { useStore } from "@/store";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import { Field, Form } from "houseform";
import { set, z } from "zod";
import { toast } from "react-toastify";
import {
  UserIcon,
  LockIcon,
  MailIcon,
  HomeIconOutlined,
} from "@/constants/icons";

function ClientForm() {
  const { setService, service } = useStore();
  const router = useRouter();
  const registerClient = async (values) => {
    console.log("valores", values);
    const response = await UserService.sendRequest(values);
    toast.success("Solicitação enviada com sucesso");
  };

  return (
    <Form
      onSubmit={(values) => {
        registerClient(values);
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
            name="hostel"
            onChangeValidate={z.string().refine((val) => val, {
              message: "Required field",
            })}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder="Nome do Hostel"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    icon={HomeIconOutlined}
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
            name="name"
            onChangeValidate={z.string().refine((val) => val, {
              message: "Required field",
            })}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <OutlinedInput
                    placeholder="Nome de contato"
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
                    icon={MailIcon}
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
          <OutlinedButton text="Enviar" disabled={!isValid} />
        </form>
      )}
    </Form>
  );
}

export default ClientForm;
