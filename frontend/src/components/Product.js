import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-1 p-3 rounded h-100">
      <Link to={`products/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`products/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
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
        </Card.Text>

        <Card.Text as="h3">{product.price}KM</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
