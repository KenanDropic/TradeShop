import { useEffect, useState } from "react";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Image,
  Card,
} from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import {
  getOrderDetails,
  markOrderAsDelivered,
  resetIsDelivered,
  updateOrderToPaid,
} from "../features/orders/ordersSlice";
import Loader from "../components/Loader";
import axios from "axios";
import HelmetM from "../components/HelmetM";
import { resetCart } from "../features/cart/cartSlice";

const OrderS = () => {
  const [sdkReady, setSdkReady] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    order,
    error: ordersError,
    loading,
    isDelivered,
  } = useSelector((state) => state.orders);
  const {
    orderItems,
    taxPrice,
    totalPrice,
    shippingPrice,
    shippingAddress,
    paymentMethod,
  } = order;
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    const paypalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (order?.length === 0 || order?.isPaid === true || isDelivered) {
      dispatch(getOrderDetails(id));
      dispatch(resetIsDelivered());
    } else if (!order?.isPaid) {
      if (!window.paypal) {
        paypalScript();
      } else {
        setSdkReady(true);
      }
    }
    // eslint-disable-next-line
  }, [id, dispatch, isDelivered, order?.isPaid, order?.length]); // u deps array-u je bio i property order?.isPaid

  const successPaymentHandler = (paymentResult) => {
    dispatch(updateOrderToPaid([id, paymentResult]));
    dispatch(resetCart());
  };

  const handleDeliver = () => {
    dispatch(markOrderAsDelivered(id));
  };

  return order.length === 0 || loading === true ? (
    <Loader />
  ) : ordersError ? (
    <Message variant="danger">{ordersError}</Message>
  ) : (
    <>
      <HelmetM title="Narudžba" />
      <Row>
        <h1>NARUDŽBA {id}</h1>
        <Col xxl="3" xl="4" lg="4" md="4" sm="0" xs="0" className="mb-5">
          <Card>
            <ListGroup vriant="flush">
              <ListGroup.Item className="px-2">
                <h2 className="m-0 p-2 px-0">Sažetak nardužbe</h2>
              </ListGroup.Item>
              <ListGroup.Item className="m-0 p-2">
                <Row>
                  <Col>Stavke</Col>
                  <Col>
                    {(totalPrice - taxPrice - shippingPrice).toFixed(2)} KM
                  </Col>
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
                  <Col>{taxPrice} KM</Col>
                </Row>
              </ListGroupItem>
              <ListGroup.Item className="m-0 p-2">
                <Row>
                  <Col>Ukupno</Col>
                  <Col>{totalPrice} KM</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroupItem>
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroupItem>
              )}
              <ListGroupItem>
                {order?.isPaid &&
                  user?.role === "admin" &&
                  !order?.isDelivered && (
                    <Button
                      type="button"
                      className="btn btn-block"
                      variant="dark"
                      onClick={handleDeliver}
                    >
                      Označi kao isporučeno
                    </Button>
                  )}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
        <Col xxl="8" xl="8" lg="8" md="8" sm="12" xs="12">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>DOSTAVA</h4>
              <span className="d-block">
                Ime: <strong>{order.user?.name}</strong>
              </span>
              <span className="d-block">
                Email: <strong>{order.user?.email}</strong>
              </span>
              <span className="d-block mb-2">
                Adresa:
                <strong>
                  {shippingAddress.postalCode},{shippingAddress.address},
                  {shippingAddress.country}
                </strong>
              </span>
              {order.isDelivered ? (
                <Message variant="success">
                  Dostavljeno - {order?.deliveredAt}
                </Message>
              ) : (
                <Message variant="info">
                  <strong>Pošiljka nije dostavljena</strong>
                </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>NAČIN PLAĆANJA</h4>
              <span className="d-block mb-2">
                Metoda: <strong>{paymentMethod}</strong>
              </span>
              {order.isPaid ? (
                <Message variant="success">
                  Plaćeno - {order.paidAt.substring(0, 10)}{" "}
                </Message>
              ) : (
                <Message variant="info">
                  <strong>Pošiljka nije plaćena</strong>
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>IZABRANE STAVKE</h4>
              {orderItems.length === 0 ? (
                <Message>Vaša korpa je prazna</Message>
              ) : (
                <ListGroup variant="flush">
                  {orderItems.map((item, idx) => {
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

export default OrderS;
