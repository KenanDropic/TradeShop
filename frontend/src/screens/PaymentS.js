import FormContainer from "../components/FormContainer";
import MultiStep from "../components/MultiStep";
import { Row, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

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

  if (!shippingAddress) {
    navigate("/shipping");
  }

  const onSubmit = (data) => {
    console.log(data);
    // navigate to placeorder
  };

  return (
    <FormContainer>
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
