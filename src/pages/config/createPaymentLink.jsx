import { useState, useEffect } from "react";
import { Form, Field } from "houseform";
import { z } from "zod";
import InputText from "@/components/utils/inputs/InputText";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { toast } from "react-toastify";
import { Rings } from "react-loader-spinner";
import StripeService from "@/services/StripeService";
import {
  FaCcStripe,
  FaMoneyBill,
  FaUser,
  FaEnvelope,
  FaListOl,
  FaHashtag,
} from "react-icons/fa";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import { toStripeAmount } from "@/utils/stripeHelpers";
import CheckoutLinkModal from "@/components/utils/modal/CheckoutLinkModal";

export default function CreateCheckoutLink() {
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [enableQuantity, setEnableQuantity] = useState(false);
  const [enableDefaultQty, setEnableDefaultQty] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    defaultQty: "",
  });

  useEffect(() => {
    setLoadingPage(true);
    return delay(() => setLoadingPage(false));
  }, []);

  const getTotalClient = () => {
    const price = parseFloat(form.amount || 0);
    const qty =
      enableQuantity && enableDefaultQty && form.defaultQty
        ? Number(form.defaultQty)
        : 1;
    const bruto = price * qty;
    return Math.ceil((bruto / 0.9) * 100) / 100;
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      setCheckoutUrl("");

      const unitPrice = parseFloat(values.amount || 0);
      const amountFinal = toStripeAmount(unitPrice);

      const payload = {
        ...values,
        amount: amountFinal,
        minQty: enableQuantity ? Number(values.minQty || 1) : undefined,
        maxQty: enableQuantity ? Number(values.maxQty || 10) : undefined,
        defaultQty:
          enableQuantity && enableDefaultQty
            ? Number(values.defaultQty || 1)
            : undefined,
      };

      const response = await StripeService.createCheckoutLink(payload);
      const data = response.data;
      if (data.url) {
        setCheckoutUrl(data.url);
        setShowModal(true);
      } else {
        toast.error(data.error || "Error generando link", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1500,
        });
      }
    } catch (error) {
      toast.error("Error inesperado", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`px-4 flex flex-col items-center ${
        loadingPage ? opacityAnimation : displayAnimation
      }`}
    >
      <CheckoutLinkModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        url={checkoutUrl}
      />

      <div className="bg-backgroundCard rounded-xl px-3 py-3 shadow w-full max-w-md mb-32">
        <Form onSubmit={(values) => handleCreate(values)}>
          {({ isValid, submit }) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <div className="flex flex-row items-center mb-5">
                <h2 className="text-xl text-textColor mr-3 text-center font-bold ">
                  Crear link de pago
                </h2>
                <FaCcStripe className="text-black dark:text-white" size={40} />
              </div>

              <Field
                name="name"
                onChangeValidate={z.string().min(1, "Nombre obligatorio")}
              >
                {({ value, setValue, onBlur, errors }) => (
                  <>
                    <InputText
                      icon={FaUser}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onBlur={onBlur}
                      placeholder="Nombre del servicio"
                      className="w-full"
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
                  </>
                )}
              </Field>

              <Field
                name="amount"
                onChangeValidate={z
                  .string()
                  .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
                    message: "Precio inválido",
                  })}
              >
                {({ value, setValue, onBlur, errors }) => (
                  <>
                    <InputText
                      icon={FaMoneyBill}
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        setForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }));
                      }}
                      onBlur={onBlur}
                      placeholder="Precio por unidad (R$)"
                      type="number"
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
                  </>
                )}
              </Field>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="enableQty"
                  checked={enableQuantity}
                  onChange={(e) => {
                    setEnableQuantity(e.target.checked);
                    if (!e.target.checked) {
                      setEnableDefaultQty(false);
                    }
                  }}
                  className="accent-gray-400 w-4 h-4 ml-2"
                />
                <label
                  htmlFor="enableQty"
                  className="text-sm text-textColorGray"
                >
                  Activar cantidades ajustables
                </label>
              </div>

              {enableQuantity && (
                <>
                  <Field name="minQty">
                    {({ value, setValue }) => (
                      <InputText
                        icon={FaListOl}
                        value={value || ""}
                        className="my-2"
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Cantidad mínima"
                        type="number"
                      />
                    )}
                  </Field>

                  <Field name="maxQty">
                    {({ value, setValue }) => (
                      <InputText
                        icon={FaListOl}
                        className="my-2"
                        value={value || ""}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Cantidad máxima"
                        type="number"
                      />
                    )}
                  </Field>

                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="defaultQty"
                      checked={enableDefaultQty}
                      onChange={(e) => setEnableDefaultQty(e.target.checked)}
                      className="accent-gray-400 w-4 h-4 ml-2"
                    />
                    <label
                      htmlFor="defaultQty"
                      className="text-sm text-textColorGray"
                    >
                      Definir cantidad por defecto
                    </label>
                  </div>

                  {enableDefaultQty && (
                    <Field name="defaultQty">
                      {({ value, setValue }) => (
                        <InputText
                          icon={FaHashtag}
                          value={value || ""}
                          onChange={(e) => {
                            setValue(e.target.value);
                            setForm((prev) => ({
                              ...prev,
                              defaultQty: e.target.value,
                            }));
                          }}
                          placeholder="Cantidad inicial sugerida"
                          type="number"
                          className="my-4"
                        />
                      )}
                    </Field>
                  )}
                </>
              )}

              <Field name="email">
                {({ value, setValue, onBlur, errors }) => (
                  <>
                    <InputText
                      icon={FaEnvelope}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onBlur={onBlur}
                      placeholder="Email del cliente (opcional)"
                      type="email"
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
                  </>
                )}
              </Field>

              <Field name="description">
                {({ value, setValue }) => (
                  <InputText
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Descripción (opcional)"
                  />
                )}
              </Field>

              {loading ? (
                <div className="flex justify-center mt-4">
                  <Rings width={60} height={60} color="#00A0D5" />
                </div>
              ) : (
                <OutlinedButton
                  text="Generar link"
                  disabled={!isValid}
                  px={2}
                  py="py-2"
                  dark="darkHeavy"
                  textColor="text-white"
                  textSize="text-sm"
                  margin="mt-4"
                  buttonCenter={true}
                />
              )}

              {!loading && form.amount && (
                <div className="bg-gray-100 dark:bg-backgroundCard p-4 rounded-lg mt-3">
                  <h3 className="font-semibold text-textColor mb-2">Resumen</h3>
                  <p className="text-sm text-textColorGray">
                    Precio por unidad:{" "}
                    <span className="font-medium text-textColor">
                      R${Number(form.amount).toFixed(2)}
                    </span>
                  </p>
                  {enableQuantity && enableDefaultQty && form.defaultQty && (
                    <p className="text-sm text-textColorGray">
                      Cantidad sugerida:{" "}
                      <span className="font-medium text-textColor">
                        {form.defaultQty}
                      </span>
                    </p>
                  )}
                  <p className="text-sm text-textColorGray">
                    Comisión del 10% incluida
                  </p>
                  <p className="text-sm text-textColorGray mt-2">
                    Total a cobrar al cliente:{" "}
                    <span className="font-semibold text-green-600">
                      R${getTotalClient()}
                    </span>
                  </p>
                </div>
              )}
            </form>
          )}
        </Form>
      </div>
    </div>
  );
}
