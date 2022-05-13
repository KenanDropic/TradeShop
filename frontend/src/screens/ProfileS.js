import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import { useForm } from "react-hook-form";
import Message from "../components/Message";
import { updateUser } from "../features/users/usersSlice";

const ProfileS = () => {
  // eslint-disable-next-line
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.users);

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
    // dispatch update profile
    dispatch(updateUser(data));
  };

  // fill form fields with user info
  useEffect(() => {
    if (user !== null) {
      const defaults = {
        name: user?.name,
        email: user?.email,
      };

      reset(defaults);
    }
  }, [reset, user]);

  return (
    <Row>
      <Col sm="3" md="3" xs="3" lg="3" xl="3">
        <h2>Profil Korisnika - {user?.name}</h2>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
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
      </Col>
      <Col sm="9" md="9" xs="9" lg="9" xl="9"></Col>
    </Row>
  );
};

export default ProfileS;
