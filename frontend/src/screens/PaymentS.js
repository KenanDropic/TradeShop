import FormContainer from "../components/FormContainer";
import MultiStep from "../components/MultiStep";
import { Row } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentS = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isPaymentS } = useSelector((state) => state.cart);

  return (
    <FormContainer>
      <h1>PLAĆANJE</h1>
      <Row>
        <MultiStep currentStep={3} />
      </Row>
    </FormContainer>
  );
};

export default PaymentS;
