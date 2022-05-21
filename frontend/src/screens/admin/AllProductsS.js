import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteProduct,
  listProducts,
} from "../../features/products/productsSlice";

const AllProductsS = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error, isDeleted } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(listProducts());
    // eslint-disable-next-line
  }, [dispatch, isDeleted]);

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati proizvod")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Row className="align-items-center justify-content-between">
            <Col>
              <h2>PROIZVODI</h2>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button
                className="my-3"
                onClick={() => navigate("/admin/products/create")}
              >
                <i className="fas fa-plus" /> Kreirajte proizvod
              </Button>
            </Col>
          </Row>
          <Row>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>IME</th>
                  <th>CIJENA</th>
                  <th>KATEGORIJA</th>
                  <th>BREND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products?.length > 0 &&
                  products?.map((product, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>
                          <Link to={`${product._id}/edit`}>
                            <Button variant="light" className="btn-sm">
                              <i className="fas fa-edit" />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </>
  );
};

export default AllProductsS;
