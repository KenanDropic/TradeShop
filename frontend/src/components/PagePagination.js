import { Col, Pagination, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setPageNumber } from "../features/products/productsSlice";

const PagePagination = () => {
  const dispatch = useDispatch();
  const {
    pagination: { next, prev },
    pages,
    page,
  } = useSelector((state) => state.products);

  const numOfPagesArr = Array.from({ length: pages }, (_, idx) => idx + 1);

  return (
    pages > 1 && (
      <Row className="mt-5">
        <Col className="d-flex text-center justify-content-center">
          <Pagination.Prev
            className={prev ? "d-block" : "d-none"}
            onClick={() => {
              dispatch(setPageNumber(page - 1));
            }}
          />
          <Pagination>
            {numOfPagesArr?.map((idx) => {
              return (
                <Pagination.Item
                  className={idx === page ? "active" : ""}
                  key={idx}
                  onClick={() => dispatch(setPageNumber(idx))}
                >
                  {idx}
                </Pagination.Item>
              );
            })}
          </Pagination>
          <Pagination.Next
            className={next ? "d-block" : "d-none"}
            onClick={() => {
              dispatch(setPageNumber(page + 1));
            }}
          />
        </Col>
      </Row>
    )
  );
};

export default PagePagination;
