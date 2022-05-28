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
import Reviews from "../components/Reviews";
import HelmetM from "../components/HelmetM";

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
          <HelmetM title={product.name} />
          <Row>
            <Col sm="6" md="4" lg="5" xl="4" xxl="4">
              <Image src={product.image} alt="image" fluid />
            </Col>

            <Col sm="6" md="4" lg="4" xl="5">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.averageRating}
                    text={
                      product.numOfReviews === 0
                        ? ""
                        : product.numOfReviews === 2 ||
                          product.numOfReviews === 3 ||
                          product.numOfReviews === 4
                        ? `${product.numOfReviews} recenzije`
                        : `${product.numOfReviews} recenzija`
                    }
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Cijena: </strong> {product.price} KM
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm="12" md="4" lg="3" xl="3" className="mt-3">
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
          <Row className="mt-3">
            <Col xs="12" sm="12" md="4" lg="5" xl="4" xxl="4">
              <ListGroup>
                <ListGroup.Item>
                  <strong>Opis: </strong> {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md="8" lg="7" xl="8" xxl="8" className="mt-2">
              <Reviews productId={id} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductS;
