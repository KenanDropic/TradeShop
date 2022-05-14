import { Container, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import img from "../assets/images/not-found.svg";

const ErrorS = () => {
  return (
    <Container>
      <Row className="text-center" style={{ margin: "15% 0 0 0" }}>
        <Image src={img} alt="not-found" />
        <h3>Ohh! Stranica nije pronađena</h3>
        <p>Traženu stranicu nije moguće pronaći</p>
        <Link to="/">Vratite se nazad</Link>
      </Row>
    </Container>
  );
};

export default ErrorS;
