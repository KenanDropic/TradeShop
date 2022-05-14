import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Image,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import MultiStep from "../components/MultiStep";
import Message from "../components/Message";

const PlaceOrderS = () => {
  const dispatch = useDispatch();
  const { cartItems, paymentMethod, shippingAddress } = useSelector(
    (state) => state.cart
  );
  const { country, address, postalCode } = shippingAddress;

  // add zero's if there isn't enough decimals
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // cart items total price
  let total = cartItems.reduce(
    (prev, curr) => prev + curr.price * curr.quantity,
    0
  );
  // cijena dostave
  let shippingPrice = total > 100 ? 0 : 10;

  // cijena s porezom
  let priceWithTax = Number(total) + Number(total) * (17 / 100);

  const handlePlaceorder = () => {
    console.log("placeorder");
  };

  return (
    <>
      <FormContainer>
        <MultiStep currentStep={4} />
      </FormContainer>
      <Row>
        <Col xxl="3" xl="4" lg="4" md="4" sm="0" xs="0" className="mb-5">
          <Card>
            <ListGroup vriant="flush">
              <ListGroup.Item className="px-2">
                <h2 className="m-0 p-2 px-0">Sažetak nardužbe</h2>
              </ListGroup.Item>
              <ListGroup.Item className="m-0 p-2">
                <Row>
                  <Col>Stavke</Col>
                  <Col>{addDecimals(total)} KM</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="m-0 p-2">
                <Row>
                  <Col>Dostava</Col>
                  <Col>{shippingPrice} KM</Col>
                </Row>
              </ListGroup.Item>
              <ListGroupItem className="m-0 p-2">
                <Row>
                  <Col>Porez</Col>
                  <Col>17%</Col>
                </Row>
              </ListGroupItem>
              <ListGroup.Item className="m-0 p-2">
                <Row>
                  <Col>Ukupno</Col>
                  <Col>{addDecimals(priceWithTax)} KM</Col>
                </Row>
              </ListGroup.Item>
              <ListGroupItem></ListGroupItem>

              <ListGroupItem className="mx-0 p-3 ">
                <Button
                  type="button"
                  variant="dark"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={handlePlaceorder}
                >
                  Naručite
                </Button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
        <Col xxl="8" xl="8" lg="8" md="8" sm="12" xs="12">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>DOSTAVA</h4>
              <p>
                {postalCode},{address},{country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>NAČIN PLAĆANJA</h4>
              <p>{paymentMethod}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>IZABRANE STAVKE</h4>
              {cartItems.length === 0 ? (
                <Message>Vaša korpa je prazna</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, idx) => {
                    return (
                      <ListGroup.Item key={idx}>
                        <Row className="d-flex align-items-center">
                          <Col xs="3" sm="3" md="3" lg="2" xl="2" xxl="2">
                            <Image src={item.image} fluid />
                          </Col>
                          <Col
                            xs="4"
                            sm="4"
                            md="5"
                            lg="6"
                            xl="6"
                            xxl="6"
                            className="text-center"
                          >
                            {item.name}
                          </Col>
                          <Col xs="5" sm="5" md="4" lg="4" xl="4" xxl="4">
                            {item.quantity} x {item.price}KM ={" "}
                            {(
                              Number(item.quantity) * Number(item.price)
                            ).toFixed(2)}
                            KM
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderS;
