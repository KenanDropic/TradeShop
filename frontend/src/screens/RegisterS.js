import { useState, useEffect } from "react";
import { Row, Button, Form, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/users/usersSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";

const RegisterS = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, isLogged } = useSelector((state) => state.users);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // register user
  const onSubmit = async (data) => {
    dispatch(registerUser(data));
    navigate("/profile");
  };

  useEffect(() => {
    if (isLogged) {
      // navigate("/profile");
    }
  }, [isLogged, navigate]);

  return (
    <FormContainer>
      <h1>REGISTRACIJA</h1>
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
              placeholder="Unesite ime"
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
              placeholder="Enter Email Address"
            />
            <span style={{ color: "red", display: "block" }}>
              {errors.email?.message}
            </span>
          </Form.Group>
          <Form.Group>
            <Form.Label>Šifra</Form.Label>
            <div className="d-flex position-relative">
              <Form.Control
                {...register("password", {
                  required: "Polje je obavezno",
                  pattern: {
                    value:
                      // eslint-disable-next-line
                      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    message:
                      "Šifra se mora sastojati od najmanje 6 karaktera,velikog i malog slovo,specijalnog karaktera i broja",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Unesite šifru"
              />
              <i
                className={`i-pass ${
                  showPassword ? "fas fa-eye" : "fas fa-eye-slash"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <span style={{ color: "red", display: "block" }}>
              {errors.password?.message}
            </span>
          </Form.Group>
          <Button type="submit" variant="dark" className="mt-4">
            Registrujte se
          </Button>
        </Form>
      </Row>
      <Row className="py3 mt-4">
        <Col>
          Već ste registrovani? <Link to="/register">Prijavite se?</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterS;
