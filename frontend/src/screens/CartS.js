import {
  Card,
  Col,
  Row,
  ListGroup,
  Button,
  Image,
  ListGroupItem,
  FormControl,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  setIsShipping,
} from "../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";

const CartS = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // cart items total price
  let total = cartItems
    .reduce((prev, curr) => prev + curr.price * curr.quantity, 0)
    .toFixed(2);

  // cart items subtotal
  let subtotal = cartItems.reduce(
    (prev, curr) => prev + Number(curr.quantity),
    0
  );

  // remove
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // checkout
  const checkoutHandler = () => {
    dispatch(setIsShipping());
    navigate("/shipping");
    // if logged in navigate to /shipping,else navigate to /login
  };

  return (
    <Row>
      <Col xxl={8} xl={9} lg={8} md={8} sm={12} xs={12} className="mb-5">
        <h1>Korpa za kupovinu</h1>
        {cartItems.length === 0 ? (
          <Message>
            Vaša korpa je prazna <Link to="/">Vratite se nazad</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => {
              return (
                <ListGroupItem key={idx}>
                  <Row className="align-items-center">
                    <Col xs={2} sm={2} md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col sm={5} md={5} xs={4}>
                      <Link to={`/products/${item.id}`}>{item.name}</Link>
                    </Col>
                    <Col sm={2} md={2} xs={2}>
                      {item.price}KM
                    </Col>

                    {item.countInStock > 0 && (
                      <Col sm={2} md={2} xs={2}>
                        <FormControl
                          className="text-center"
                          as="select"
                          value={item.quantity}
                          onChange={(e) => {
                            dispatch(
                              addToCart([item.id, Number(e.target.value)])
                            );
                          }}
                        >
                          {Array.from(
                            { length: item.countInStock },
                            (_, i) => i + 1
                          ).map((x) => {
                            return (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            );
                          })}
                        </FormControl>
                      </Col>
                    )}
                    <Col xs={1} sm={1} md={1}>
                      <Button
                        type="button"
                        style={{ fontSize: "18px", cursor: "pointer" }}
                        variant="light"
                        onClick={() => removeFromCartHandler(item.id)}
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        )}
      </Col>

      <Col xxl={4} xl={3} lg={4} md={4} sm={0} xs={0}>
        <Card>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h5>{`UKUPNO (${subtotal}) ${
                subtotal === 1 ? "PREDMET" : "PREDMETA"
              }`}</h5>
              <span className="price">{`${total} KM`}</span>
            </ListGroupItem>

            <ListGroupItem>
              <Button
                type="button"
                className="btn-block btn-dark"
                disabled={cartItems.length < 1}
                onClick={checkoutHandler}
              >
                Nastavite s naplatom
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartS;
