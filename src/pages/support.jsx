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
  const { user, loggedIn } = useStore();
  const id = router.query.id;

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
    "⁠Issues with canceling a reservation",
    "⁠Problems with scheduling",
    "⁠Chat-related problems",
    "⁠Payment or payment method issue",
    "⁠Double payment has been made",
    "Problems or dissatisfaction with the service received",
    "⁠Reporting abuse or misconduct by a worker",
    "⁠Reporting abuse or misconduct by the facility",
    "⁠Interested in working with SOS Traveler",
    "⁠Suggestions for the app",
    "⁠Suggestions for the service",
    "⁠Account access or login issue",
    "Technical difficulties using the platform",
    "⁠General inquiries about SOS Travelers services",
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
        Support: How can we help you?
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
                  <p>Email Address</p>
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
              <p>Choose a subject</p>
              <Field
                name="subject"
                onBlurValidate={z.string().refine((val) => val, {
                  message: "You must choose an option",
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
              <p>Message</p>
              <Field
                name="message"
                onBlurValidate={z.string().refine((val) => val, {
                  message: "You must enter a message",
                })}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <OutlinedTextArea
                        placeholder="Enter Message"
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
                text="Send Message"
                disabled={!isValid || isSubmitting}
              />
            ) : (
              <p className="text-sm">
                We have received your message!!. We will reply to you as soon as
                possible
              </p>
            )}
          </form>
        )}
      </Form>
    </div>
  );
}
