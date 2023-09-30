import { useRouter } from "next/router";

import PayPalService from "@/services/PayPalService";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";

const PayPalPayment = () => {
  const router = useRouter();
  const { service } = useStore();

  const createOrder = async (values) => {
    try {
      const response = await PayPalService.createOrder({
        description: "servicio de barbero",
        cost: "25.60",
      });
      console.log("orden creada ->", response);
      if (response.id) {
        console.log("entro");
        return response.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      let message;
      if (error?.response?.status === 409)
        message = error?.response?.data?.message;
      else if (error?.response?.status === 400)
        message = error?.response?.data?.result;
      toast.error(message);
    }
  };

  const onApprove = async (data) => {
    try {
      console.log("activando onApprove", data);
      const response = await PayPalService.onApprove({
        orderID: data.orderID,
      });
      if (response) {
        console.log("aprobado");
        await createBooking();
        router.push("/payment-confirmation");
      }
    } catch (error) {
      let message;
      if (error?.response?.status === 409)
        message = error?.response?.data?.message;
      else if (error?.response?.status === 400)
        message = error?.response?.data?.result;
      toast.error(message);
    }
  };

  const createBooking = async () => {
    const userId = localStorage.getItem("auth.user_id");
    const startTime = service.hour.toUpperCase();
    const endTime = moment(service.hour, "hh:mm a")
      .add(1, "hour")
      .format("hh:mm a")
      .toUpperCase();
    const params = {
      worker: service.workerId,
      client: userId,
      creator: userId,
      startTime: startTime,
      endTime: endTime,
      date: service.date,
    };
    const response = await BookingService.create(params);
    console.log(response);
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data)}
      onApprove={(data, actions) => onApprove(data)}
    />
  );
};
export default PayPalPayment;
