import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import Loader from "../components/Loader";
import { useForm } from "react-hook-form";
import Message from "../components/Message";
import { updateUser } from "../features/users/usersSlice";
import { getUserOrders } from "../features/orders/ordersSlice";
import { Link } from "react-router-dom";

const ProfileS = () => {
  // eslint-disable-next-line
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.users);
  const {
    userOrders: { orders, count },
    error: ordersError,
    loading: ordersLoading,
  } = useSelector((state) => state.orders);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // update user profile
  const onSubmit = async (data) => {
    dispatch(updateUser(data));
  };

  // fill form fields with user info
  useEffect(() => {
    if (user !== null) {
      const defaults = {
        name: user?.name,
        email: user?.email,
      };
      dispatch(getUserOrders(user._id));
      reset(defaults);
    }
    // eslint-disable-next-line
  }, [reset, user]);

  return (
    <Row>
      <Col sm="3" md="3" xs="3" lg="3" xl="3">
        <h2>Profil Korisnika - {user?.name}</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  {...register("name", {
                    required: "Polje je obavezno",
                    minLength: {
                      value: 3,
                      message: "Ime mora imati najmanje 3 karaktera",
                    },
                  })}
                  type="text"
                  placeholder="Unesite Ime"
                />
                <span style={{ color: "red", display: "block" }}>
                  {errors.name?.message}
                </span>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  {...register("email", {
                    required: "Polje je obavezno",
                    pattern: {
                      // eslint-disable-next-line
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Invalid email",
                    },
                  })}
                  type="email"
                  placeholder="Unesite Email"
                />
                <span style={{ color: "red", display: "block" }}>
                  {errors.email?.message}
                </span>
              </Form.Group>
              <Button type="submit" variant="dark" className="mt-4">
                Ažurirajte
              </Button>
            </Form>
          </Row>
        )}
      </Col>
      <Col sm="9" md="9" xs="9" lg="9" xl="9">
        <h2 style={{ textAlign: "right" }}>Vaše narudžbe</h2>
        {ordersLoading ? (
          <Loader />
        ) : ordersError ? (
          <Message variant="info">Trenutno nemate narudžbi</Message>
        ) : (
          orders?.length > 0 && (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATUM</th>
                  <th>UKUPNO</th>
                  <th>PLAĆENO</th>
                  <th>DOSTAVLJENO</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice} KM</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          />
                        )}
                      </td>
                      <td>
                        <Link to={`/orders/${order._id}`}>
                          <Button className="btn-sm" variant="light">
                            Detalji
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )
        )}
      </Col>
    </Row>
  );
};

export default ProfileS;