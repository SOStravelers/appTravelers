import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "@/store";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import GoogleButton from "@/components/utils/buttons/GoogleButton";

import { Field, Form } from "houseform";
import { set, z } from "zod";
import { toast } from "react-toastify";
import { UserIcon, LockIcon, MailIcon } from "@/constants/icons";
import UserService from "@/services/UserService";

import Cookies from "js-cookie";
function ClientForm() {
  const { setService, service } = useStore();
  const router = useRouter();
  const registerClient = async (values) => {
    console.log(values);
    if (values) {
      setService({
        ...service,
        clientName: values.name,
        clientEmail: values.email,
      });
      router.push(`/summary`);
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
            name="name"
            onChangeValidate={z.string().refine((val) => val, {
              message: "Required field",
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
          <OutlinedButton text="Continuar" disabled={!isValid} />
        </form>
      )}
    </Form>
  );
}

export default ClientForm;
