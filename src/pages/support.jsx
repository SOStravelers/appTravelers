import { useEffect, useState } from "react"; //useState: variables locales --- useEffect: variable auxiliar/observador
import { useRouter } from "next/router";
import { useStore } from "@/store";
import Link from "next/link";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { Field, Form } from "houseform";
import { z } from "zod";

import { toast } from "react-toastify";

export default function SupportPage() {
  const router = useRouter();
  const { user, loggedIn, isWorker } = useStore();
  const id = router.query.id;


 // usereffect
/*   const islogged = async () => {
    
    console.log ("chupalo coloro")
  };
  useEffect(() => {
    islogged();
  }, []); */

  const sendEmail = async (values) => {
    try {
      const response = await UserService.sendEmail(
        values.name,
        values.email,
        values.subject,
        values.body
      );
      // if (response.data.user.type && response.data.user.type != "personal") {
      //   localStorage.setItem("type", response.data.user.type);
      // }
      delete response.data.user.type; //falla
      toast.success('Message sent Successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }catch (error) {
        let message = "Error sending message"; //variables let se pueden reescribir
        if (error?.response?.status === 409)
          message = error?.response?.data?.message;
        else if (error?.response?.status === 400)
          message = error?.response?.data?.result;
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
      }
};

  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
    <Form
      onSubmit={(values) => {
        sendEmail(values);
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
                name="Full Name"
                onBlurValidate={z.string().refine((val) => {
                    // Verificar que el texto tenga más de 5 caracteres y no contenga números
                    return val.length > 5 && !/\d/.test(val);
                }, {
                    message: "Invalid Name",
                })}
            >
                {({ value, setValue, onBlur, errors }) => {
                    return (
                        <div>
                            <OutlinedInput
                                placeholder="Full Name"
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

            <Field
                name="email"
                onBlurValidate={z.string().email("Invalid email")}
            >
                {({ value, setValue, onBlur, errors }) => {
                return (
                    <div>
                    <OutlinedInput
                        placeholder="Email Address"
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
            <OutlinedButton text="Send Email" disabled={!isValid} /> 
        </form>
      )}
    </Form>
     

    </div>
  );
}