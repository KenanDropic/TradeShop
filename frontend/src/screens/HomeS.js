import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../features/products/productsSlice";
import Search from "../components/Search";
import PagePagination from "../components/PagePagination";
import HelmetM from "../components/HelmetM";

const HomeS = () => {
  const dispatch = useDispatch();
  const { loading, products, error, searchKeyword, page } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(listProducts([page, searchKeyword]));
  }, [dispatch, searchKeyword, page]);

  return (
    <>
      <HelmetM />
      <h1>Najnoviji proizvodi</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Search />
          {products.length === 0 && (
            <>
              <Message variant="info">Nema traženih proizvoda</Message>
            </>
          )}
          <Row>
            {products.map((product, idx) => {
              return (
                <Col key={idx} sm={12} md={4} lg={3} xl={3} className="mb-3">
                  <Product product={product} />
                </Col>
              );
            })}
            <PagePagination />
          </Row>
        </>
      )}
    </>
  );
};

export default HomeS;
