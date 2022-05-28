import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { confirmEmail } from "../features/users/usersSlice";

const ConfirmEmailS = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token !== null) {
      dispatch(confirmEmail(token));
    }
  }, [token, dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Modal
      show={!loading}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <p>
          Čestitamo! Uspješno ste potvrdili vaš email. Osvježite stranicu i
          nastavite s aktivnošću.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button>
          <Link to="/" style={{ color: "#eee" }}>
            Vratite se nazad
          </Link>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmEmailS;
