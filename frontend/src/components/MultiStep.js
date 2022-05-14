import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const MultiStep = ({ currentStep }) => {
  const arrFromSteps = Array.from({ length: 4 }, (_, i) => i + 1);

  return (
    <Row className="progress-steps mt-2">
      {/* Linija koja ukazuje na progress */}
      <div
        className="progress"
        data-step={currentStep}
        style={{
          width: `${(currentStep - 1) * 33}%`,
        }}
      ></div>
      {arrFromSteps.map((step, idx) => {
        return (
          <Col
            className={`step mx-0 px-0 ${
              currentStep >= step ? "active-step" : ""
            }`}
            data-title={` ${
              idx === 0
                ? "Prijava"
                : idx === 1
                ? "Narudžba"
                : idx === 2
                ? "Naplata"
                : "Dostava"
            }`}
            key={idx}
            xs={3}
            sm={3}
            md={3}
            lg={3}
            xl={2}
          >
            {idx === 0 ? (
              "1"
            ) : idx === 1 ? (
              <Link to="/shipping" style={{ cursor: "pointer" }}>
                2
              </Link>
            ) : idx === 2 ? (
              <Link to="/payment" style={{ cursor: "pointer" }}>
                3
              </Link>
            ) : (
              <Link to="/placeorder" style={{ cursor: "pointer" }}>
                4
              </Link>
            )}
          </Col>
        );
      })}
    </Row>
  );
};

export default MultiStep;
