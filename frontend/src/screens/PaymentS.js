import FormContainer from "../components/FormContainer";
import MultiStep from "../components/MultiStep";

const PaymentS = () => {
  return (
    <FormContainer>
      <h1>Plaćanje</h1>
      <MultiStep currentStep={3} />
    </FormContainer>
  );
};

export default PaymentS;
