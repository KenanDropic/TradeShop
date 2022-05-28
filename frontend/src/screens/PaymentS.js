import FormContainer from "../components/FormContainer";
import MultiStep from "../components/MultiStep";
import { Row, Form, Button } from "react-bootstrap";
import { savePaymentMethod } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import HelmetM from "../components/HelmetM";
import { useEffect } from "react";

const PaymentS = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector((state) => state.cart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "",
    },
  });

  useEffect(() => {
    if (Object.keys(shippingAddress).length === 0) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const onSubmit = (data) => {
    dispatch(savePaymentMethod(data.paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <HelmetM title="Plaćanje" />
      <MultiStep currentStep={3} />
      <h1>PLAĆANJE</h1>
      <Row>
        <h1 className="text-muted">Odaberite metodu plaćanja</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Check
              {...register("paymentMethod", {
                required: "Polje je obavezno",
              })}
              name="paymentMethod"
              type="radio"
              value="PayPal"
              label="PayPal ili Kreditna kartica"
            />
          </Form.Group>
          <span style={{ color: "red", display: "block" }}>
            {errors.paymentMethod?.message}
          </span>
          <Button type="submit" variant="dark" className="mt-3">
            Nastavite
          </Button>
        </Form>
      </Row>
    </FormContainer>
  );
};

export default PaymentS;
