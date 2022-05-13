import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getSingleProduct } from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";

const ProductS = () => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  // get id from params
  const { id } = useParams();
  const dispatch = useDispatch();
  // product state
  const { loading, product, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
    dispatch(addToCart([id, qty]));
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Vratite se nazad
      </Link>

      {loading || product === null ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt="image" fluid />
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={
                      product.numReviews === 0
                        ? "0 reviews"
                        : product.numReviews === 1
                        ? `${1} review`
                        : `${product.numReviews} reviews`
                    }
                  />
                </ListGroup.Item>
                <ListGroup.Item>Cijena: {product.price} KM</ListGroup.Item>
                <ListGroup.Item>Opis: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Cijena:</Col>
                      <Col>
                        <strong>{product.price} KM</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "Dostupno" : "Nedostupno"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <Form.Label htmlFor="">Količina:</Form.Label>
                        </Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {Array.from(
                              { length: product.countInStock },
                              (_, i) => i + 1
                            ).map((x) => {
                              return (
                                <option key={x} value={x}>
                                  {x}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Dodajte u korpu
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductS;
