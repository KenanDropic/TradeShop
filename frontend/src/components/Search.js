import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  resetQuery,
  setSearchKeyword,
} from "../features/products/productsSlice";

const Search = () => {
  const dispatch = useDispatch();
  const { searchKeyword, page } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const [searchWord, setSearchWord] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!searchWord.trim() || searchWord.trim().length === 0) {
      navigate(`/page/${page}`);
    } else {
      navigate(`/search/${searchWord}/page/${page}`);
    }

    dispatch(setSearchKeyword(searchWord));
  };

  return (
    <Row>
      <Form onSubmit={handleSubmit} className="mb-3 d-flex">
        <Form.Group className="d-flex w-100 mx-2">
          <Form.Control
            placeholder="Pronađite proizvod"
            type="text"
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="dark" className="">
          Pretražite
        </Button>
      </Form>
      {searchKeyword !== "" && (
        <Link to="/" onClick={() => dispatch(resetQuery())}>
          Vratite se nazad
        </Link>
      )}
    </Row>
  );
};

export default Search;
