import { useEffect, useState } from "react";
import { Row, Button, Form, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/users/usersSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";

const LoginS = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.users);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(login(data));
  };
  // login user
  useEffect(() => {
    if (user) {
      if (!loading) {
        return navigate(from, { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [user]);

  return loading ? (
    <Loader />
  ) : (
    <>
      {error && <Message variant="danger">{error}</Message>}
      <FormContainer>
        <h1>PRIJAVA</h1>
        <Row>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email">
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
                        "Šifra se mora sastojati od najmanje 8 karaktera,uključujući veliko i malo slovo,specijalni karakter i broj",
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
              Prijavite se
            </Button>
          </Form>
        </Row>
        <Row className="py3 mt-4">
          <Col>
            Nemate profil? <Link to="/register">Registrujte se?</Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginS;
