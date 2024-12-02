import { useEffect, useState } from "react"; //useState: variables locales --- useEffect: variable auxiliar/observador
import { useRouter } from "next/router";
import { useStore } from "@/store";
import UserService from "@/services/UserService";
import Link from "next/link";
import Select from "react-select";
import languageData from "@/language/support.json";
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
  const [optionsSupport, setOptionsSupport] = useState([]);
  const router = useRouter();
  const { user, loggedIn, isWorker, language } = useStore();
  const id = router.query.id;
  useEffect(() => {
    document.title = "Support | SOS Travelers";
  }, []);
  useEffect(() => {
    let array = [];
    console.log("wena", languageData.issues);
    for (let item of languageData.issues) {
      array.push(item[language]);
    }
    console.log("aaray", array);
    const final = array.map((issue) => ({
      value: issue,
      label: issue,
    }));
    console.log("final", final);
    setOptionsSupport(final);
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

  // const optionsSupport = [
  //   ,
  // ].map((issue) => ({
  //   value: issue,
  //   label: issue,
  // }));

  useEffect(() => {
    // Este efecto se ejecutará cada vez que la clave del formulario cambie
    // Puedes realizar cualquier otra lógica necesaria aquí
  }, [formKey]);

  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-3 font-semibold text-center max-w-lg">
        {languageData.title[language]}
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
                  <p>{languageData.fullName[language]}</p>
                  <Field
                    name="name"
                    onBlurValidate={z.string().refine(
                      (val) => {
                        // Verificar que el texto tenga más de 5 caracteres y no contenga números
                        return val.length > 5 && !/\d/.test(val);
                      },
                      {
                        message: languageData.invalidName[language],
                      }
                    )}
                  >
                    {({ value, setValue, onBlur, errors }) => {
                      return (
                        <div>
                          <OutlinedInput
                            placeholder={languageData.enterName[language]}
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
                  <p>{languageData.emailAddress[language]}</p>
                  <Field
                    name="email"
                    onBlurValidate={z
                      .string()
                      .email(languageData.invalidEmail[language])}
                  >
                    {({ value, setValue, onBlur, errors }) => {
                      return (
                        <div>
                          <OutlinedInput
                            placeholder={languageData.enterEmail[language]}
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
              <p>{languageData.chooseSubject[language]}</p>
              <Field
                name="subject"
                onBlurValidate={z
                  .string()
                  .refine(
                    (val) => val,
                    languageData.mustChooseOption[language]
                  )}
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
                            ? "#00A0D5" // Fondo sólido más fuerte para la opción seleccionada
                            : state.isFocused
                            ? "rgba(0, 119, 182, 0.2)" // Fondo más suave para el hover
                            : "#fff", // Fondo blanco por defecto
                          borderRadius: "5px",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(0, 119, 182, 0.2)", // Hover igual al enfoque
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
              <p>{languageData.message[language]}</p>
              <Field
                name="message"
                onBlurValidate={z
                  .string()
                  .refine(
                    (val) => val,
                    languageData.mustEnterMessage[language]
                  )}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <OutlinedTextArea
                        placeholder={languageData.enterMessage[language]}
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
                text={languageData.sendMessage[language]}
                disabled={!isValid || isSubmitting}
              />
            ) : (
              <p className="text-sm">
                {languageData.messageReceived[language]}
              </p>
            )}
          </form>
        )}
      </Form>
    </div>
  );
}
