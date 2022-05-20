import { Container, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import img from "../assets/images/authorization.svg";

const UnauthorizedS = () => {
  return (
    <Container>
      <Row
        className="d-flex justify-content-center text-center"
        style={{ margin: "0% 0 0 0" }}
      >
        <h1>Pristup je zabranjen!</h1>
        <Link to={-1}>Vratite se nazad</Link>
        <Image
          src={img}
          alt="403"
          style={{
            width: "70%",
          }}
          className="mt-4"
        />
      </Row>
    </Container>
  );
};

export default UnauthorizedS;
