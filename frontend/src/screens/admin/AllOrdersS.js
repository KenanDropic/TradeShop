import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { listOrders } from "../../features/orders/ordersSlice";

const AllOrdersS = () => {
  const dispatch = useDispatch();
  const { allOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    <>
      <Row className="align-items-center justify-content-between">
        <h2>NARUDŽBE</h2>
      </Row>
      <Row>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>KORISNIK</th>
              <th>DATUM</th>
              <th>UKUPNO</th>
              <th>PLAĆENO</th>
              <th>DOSTAVLJENO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allOrders?.length > 0 &&
              allOrders?.map((order, idx) => {
                return (
                  <tr key={idx}>
                    <td>{order._id}</td>
                    <td>{order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice} KM</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i className="fas fa-times" style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i className="fas fa-times" style={{ color: "red" }} />
                      )}
                    </td>

                    <td>
                      <Link to={`/orders/${order._id}`}>
                        <Button variant="light" className="btn-sm">
                          Detalji
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Row>
    </>
  );
};

export default AllOrdersS;
