import PayPalService from "@/services/PayPalService";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalPayment = () => {
    const createOrder = async (values) => {
        try {
            const response = await PayPalService.createOrder(
                {
                    description: "servicio de barbero",
                    cost: "15.99"
                }
            );
            console.log("orden creada ->", response)
        } catch (error) {
            let message;
            if (error?.response?.status === 409)
                message = error?.response?.data?.message;
            else if (error?.response?.status === 400)
                message = error?.response?.data?.result;
            toast.error(message);
        }
    };
    const onApprove = async (values) => {
        try {
            const response = await PayPalService.onApprove(
                {
                    orderID: "11",
                }
            );
            console.log("orden aprobada ->", response)
        } catch (error) {
            let message;
            if (error?.response?.status === 409)
                message = error?.response?.data?.message;
            else if (error?.response?.status === 400)
                message = error?.response?.data?.result;
            toast.error(message);
        }
    };

    return (
        <PayPalButtons
            createOrder={(data, actions) => createOrder(data)}
            onApprove={(data, actions) => onApprove(data)}
        />
    )
}
export default PayPalPayment