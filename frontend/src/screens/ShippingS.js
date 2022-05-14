import { useEffect } from "react";
import { Row, Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../features/cart/cartSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import MultiStep from "../components/MultiStep";

const ShippingS = () => {
  const dispatch = useDispatch();
  const { loading, error, isLogged } = useSelector((state) => state.users);
  const { shippingAddress } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (shippingAddress.length > 0) {
      reset(shippingAddress);
    }
    // eslint-disable-next-line
  }, [shippingAddress]);

  const onSubmit = async (data) => {
    dispatch(saveShippingAddress(data));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <MultiStep currentStep={2} />
      <h1>DOSTAVA</h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}

      <Row className="mb-5">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Adresa</Form.Label>
            <Form.Control
              {...register("address", {
                required: "Polje je obavezno",
              })}
              type="text"
              placeholder="Unesite adresu"
            />
            <span style={{ color: "red", display: "block" }}>
              {errors.address?.message}
            </span>
          </Form.Group>
          <Form.Group>
            <Form.Label>Grad</Form.Label>
            <Form.Control
              {...register("city", {
                required: "Polje je obavezno",
              })}
              type="text"
              placeholder="Unesite grad"
            />
            <span style={{ color: "red", display: "block" }}>
              {errors.city?.message}
            </span>
          </Form.Group>
          <Form.Group>
            <Form.Label>Poštanski broj</Form.Label>
            <Form.Control
              {...register("postalCode", {
                required: "Polje je obavezno",
              })}
              type="text"
              placeholder="Unesite poštanski broj"
            />
            <span style={{ color: "red", display: "block" }}>
              {errors.postalCode?.message}
            </span>
          </Form.Group>
          <Form.Group>
            <Form.Label>Država</Form.Label>
            <Form.Control
              {...register("country", {
                required: "Polje je obavezno",
              })}
              type="text"
              placeholder="Unesite državu"
            />
            <span style={{ color: "red", display: "block" }}>
              {errors.country?.message}
            </span>
          </Form.Group>
          <Button type="submit" variant="dark" className="mt-4">
            Nastavite
          </Button>
        </Form>
      </Row>
    </FormContainer>
  );
};

export default ShippingS;
