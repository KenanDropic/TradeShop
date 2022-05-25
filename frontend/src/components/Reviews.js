import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Row, Form, Button, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getProductReviews } from "../features/reviews/reviewsSlice";
import Message from "./Message";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Reviews = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, error, loading, isAdded } = useSelector(
    (state) => state.reviews
  );
  const { user } = useSelector((state) => state.users);
  const ratings = Array.from({ length: 5 }, (_, i) => i + 1);

  useEffect(() => {
    dispatch(getProductReviews(productId));
  }, [dispatch, productId, isAdded]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: "",
      comment: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(addReview([productId, data]));
    reset();
  };

  return (
    <>
      <h2 className="mb-2 p-0">Recenzije</h2>
      {reviews === null || reviews.length === 0 ? (
        <Message variant="info">Prozivod nema recenzija</Message>
      ) : loading ? (
        <Loader />
      ) : (
        <Row>
          <ListGroup variant="flush">
            {reviews.map((review) => {
              return (
                <ListGroup.Item key={review._id}>
                  <p>
                    <strong>{review.name}</strong>
                  </p>
                  <Rating value={review.rating} text={""} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              );
            })}
            <ListGroup.Item>
              <h2 className="mb-1 p-2">Ostavite recenziju</h2>
              {error && <Message variant="danger">{error}</Message>}
              {user !== null ? (
                <Form
                  className="my-0 py-0 px-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Form.Group>
                    <Form.Label>Ocjena</Form.Label>
                    <Form.Control
                      as="select"
                      {...register("rating", {
                        required: [true, "Polje je obavezno"],
                      })}
                    >
                      {ratings.map((rating) => {
                        return (
                          <option value={rating} key={rating}>
                            {rating} -{" "}
                            {`${
                              rating === 1
                                ? "Grozno"
                                : rating === 2
                                ? "Loše"
                                : rating === 3
                                ? "Dobro"
                                : rating === 4
                                ? "Vrlo dobro"
                                : "Odlično"
                            }`}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <span style={{ color: "red", display: "block" }}>
                      {errors.rating?.message}
                    </span>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Komentar</Form.Label>
                    <Form.Control
                      {...register("comment", {
                        required: [true, "Polje je obavezno"],
                      })}
                      as="textarea"
                      row="3"
                    ></Form.Control>
                    <span style={{ color: "red", display: "block" }}>
                      {errors.comment?.message}
                    </span>
                  </Form.Group>
                  <Button type="submit" className="btn mt-3">
                    Dodajte recenziju
                  </Button>
                </Form>
              ) : (
                <Message variant="info">
                  <Link to="/login">Prijavite se</Link> kako bi mogli ostaviti
                  recenziju
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Row>
      )}
      {/* <Row className="mt-3"></Row> */}
    </>
  );
};

export default Reviews;
