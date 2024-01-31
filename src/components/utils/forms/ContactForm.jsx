import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import { Field, Form } from "houseform";
import { set, z } from "zod";
import { toast } from "react-toastify";
import { UserIcon, MailIcon, HomeIconOutlined } from "@/constants/icons";

function ClientForm() {
  const registerClient = async (values) => {
    try {
      const response = await UserService.sendRequest(values);
      if (response) {
        toast.success("Solicitação enviada com sucesso");
      } else {
        toast.error("Erro ao enviar solicitação");
      }
    } catch (err) {
      toast.error("Erro ao enviar solicitação");
    }
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
