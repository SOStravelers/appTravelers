import { useEffect, useState } from "react"; //useState: variables locales --- useEffect: variable auxiliar/observador
import { useRouter } from "next/router";
import { useStore } from "@/store";
import UserService from "@/services/UserService";
import Link from "next/link";
import Select from "react-select";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import OutlinedTextArea from "@/components/utils/inputs/OutlinedTextArea";
import { Field, Form } from "houseform";
import { z } from "zod";

import { toast } from "react-toastify";

export default function SupportPage() {
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sended, setSended] = useState(false);
  const router = useRouter();
  const { user, loggedIn, isWorker } = useStore();
  const id = router.query.id;
  useEffect(() => {
    document.title = "Support | SOS Travelers";
  }, []);
  const supportEmail = async (values) => {
    try {
      if (isSubmitting) {
        // Si el formulario ya se está enviando, evita enviar múltiples veces
        return;
      }

      setIsSubmitting(true);
      const data = {
        subject: values.subject,
        message: values.message,
        name: values.name,
        email: values.email,
        user: user && user._id ? user._id : null,
      };

      // Lógica de envío del formulario
      const response = await UserService.supportEmail(data);

      console.log(response.data);
      setFormKey((prevKey) => prevKey + 1);
      setSended(true);
      toast.success("Message sent Successfully", {
        position: "top-right",
        // Configuración de la notificación de éxito
      });
    } catch (error) {
      // Manejo de errores
      let message = "Error sending message";
      if (error?.response?.status === 409)
        message = error?.response?.data?.message;
      else if (error?.response?.status === 400)
        message = error?.response?.data?.result;

      toast.error(message, {
        position: "top-right",
        // Configuración de la notificación de error
      });
    } finally {
      setIsSubmitting(false); // Establece el estado de envío del formulario a false después de finalizar
    }
  };
  const optionsSupport = [
    isWorker
      ? "⁠Problemas com o cancelamento de uma reserva"
      : "⁠Issues with canceling a reservation",
    isWorker ? "⁠Problemas com agendamento" : "⁠Problems with scheduling",
    isWorker
      ? "⁠Problemas relacionados ao chat"
      : "⁠Payment or payment method issue",
    isWorker ? "⁠Pagamento duplo foi feito" : "⁠Double payment has been made",
    "Problems or dissatisfaction with the service received",
    isWorker
      ? "Problemas ou insatisfação com o serviço recebido"
      : "⁠Reporting abuse or misconduct by a worker",
    isWorker
      ? "⁠Relatando abuso ou má conduta por parte da instalação"
      : "⁠Reporting abuse or misconduct by the facility",
    isWorker
      ? "⁠Interessado em trabalhar com SOS Traveler"
      : "⁠Interested in working with SOS Traveler",
    isWorker ? "⁠Sugestões para o aplicativo" : "⁠Suggestions for the app",
    isWorker ? "⁠Sugestões para o serviço" : "⁠Suggestions for the service",
    isWorker
      ? "⁠Acesso à conta ou problema de login"
      : "⁠Account access or login issue",
    isWorker
      ? "Dificuldades técnicas na utilização da plataforma"
      : "Technical difficulties using the platform",
    isWorker
      ? "⁠Dúvidas gerais sobre os serviços SOS Travellers"
      : "⁠General inquiries about SOS Travelers services",
    isWorker ? "⁠Excluir Conta" : "⁠Delete account",
  ].map((issue) => ({
    value: issue,
    label: issue,
  }));

  useEffect(() => {
    // Este efecto se ejecutará cada vez que la clave del formulario cambie
    // Puedes realizar cualquier otra lógica necesaria aquí
  }, [formKey]);

  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-3 font-semibold text-center max-w-lg">
        {isWorker
          ? "Suporte: Como podemos ajudá-lo?"
          : "Support: How can we help you?"}
      </h1>
      <Form
        key={formKey}
        onSubmit={(values) => {
          supportEmail(values);
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
            {!loggedIn && (
              <>
                <div className="mb-3">
                  <p>Full Name</p>
                  <Field
                    name="name"
                    onBlurValidate={z.string().refine(
                      (val) => {
                        // Verificar que el texto tenga más de 5 caracteres y no contenga números
                        return val.length > 5 && !/\d/.test(val);
                      },
                      {
                        message: "Invalid Name",
                      }
                    )}
                  >
                    {({ value, setValue, onBlur, errors }) => {
                      return (
                        <div>
                          <OutlinedInput
                            placeholder="Enter Name"
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
                </div>

                <div className="mb-3">
                  <p>{isWorker ? "Endereço de email" : "Email Address"}</p>
                  <Field
                    name="email"
                    onBlurValidate={z.string().email("Invalid email")}
                  >
                    {({ value, setValue, onBlur, errors }) => {
                      return (
                        <div>
                          <OutlinedInput
                            placeholder="Enter email"
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
                </div>
              </>
            )}

            <div className="mb-3">
              <p>{isWorker ? "Escolha um assunto" : "Choose a subject"}</p>
              <Field
                name="subject"
                onBlurValidate={z.string().refine((val) => val, {
                  message: isWorker
                    ? "Você deve escolher uma opção"
                    : "You must choose an option",
                })}
              >
                {({ value, setValue, onBlur, errors }) => (
                  <div>
                    <Select
                      className="w-full max-w-lg rounded-xl  my-1"
                      options={optionsSupport}
                      value={optionsSupport.find(
                        (option) => option.value === value
                      )}
                      onBlur={onBlur}
                      onChange={(selectedOption) =>
                        setValue(selectedOption.value)
                      }
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: "#00A0D5",
                          borderRadius: "10px",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#00A0D5",
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          color: state.isSelected ? "#fff" : "#000",
                          backgroundColor: state.isSelected
                            ? "#00A0D5"
                            : "#fff",
                          borderRadius: "5px",
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "#00A0D5",
                          },
                        }),
                      }}
                    />
                    {/* <select
                      className="border-grey border w-full max-w-lg rounded-xl p-3 my-1"
                      value={value}
                      onBlur={onBlur}
                      onChange={(e) => setValue(e.target.value)}
                    >
                      <option value="">Choose an option</option>
                      <option value="opcion1">Option 1</option>
                      <option value="opcion2">Option 2</option>
                    </select> */}
                    {errors.map((error) => (
                      <p key={error} className="text-red">
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </Field>
            </div>

            <div className="mb-3">
              <p>{isWorker ? "Mensagem" : "Message"}</p>
              <Field
                name="message"
                onBlurValidate={z.string().refine((val) => val, {
                  message: isWorker
                    ? "Você deve inserir uma mensagem"
                    : "You must enter a message",
                })}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <OutlinedTextArea
                        placeholder={
                          isWorker ? "Inserir mensagem" : "Enter Message"
                        }
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
            </div>
            {!sended ? (
              <OutlinedButton
                text={isWorker ? "Enviar mensagem" : "Send Message"}
                disabled={!isValid || isSubmitting}
              />
            ) : (
              <p className="text-sm">
                {isWorker
                  ? "Recebemos sua mensagem!!. Responderemos assim que possível"
                  : "We have received your message!!. We will reply to you as soon as possible"}
              </p>
            )}
          </form>
        )}
      </Form>
    </div>
  );
}
