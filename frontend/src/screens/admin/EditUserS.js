import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "../../features/admin/adminSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form, Row } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";

const EditUserS = () => {
  const { id } = useParams();
  //redux toolkit stuff
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const {
    userToEdit,
    loading: adminLoading,
    error: adminError,
  } = useSelector((state) => state.admin);

  // useForm hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      isAdmin: "",
    },
  });

  useEffect(() => {
    if (user?.isAdmin === false) {
      return navigate("/");
    }
    dispatch(getSingleUser(id));

    // eslint-disable-next-line
  }, [dispatch, user?.isAdmin, id]);

  // useEffect to fill form with fetched values
  useEffect(() => {
    if (userToEdit !== null) {
      const defaults = {
        name: userToEdit?.name,
        email: userToEdit?.email,
        isAdmin: userToEdit?.isAdmin,
      };
      reset(defaults);
    }
  }, [userToEdit]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return adminLoading ? (
    <Loader />
  ) : adminError ? (
    <Message variant="danger">{adminError}</Message>
  ) : (
    <>
      <Row>
        <Link to="/admin/users">Vratite se nazad</Link>
      </Row>
      <FormContainer>
        <h1>Uredite informacije o korisniku</h1>
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
            />
            <span style={{ color: "red", display: "block" }}>
              {errors.email?.message}
            </span>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Check
              {...register("isAdmin")}
              type="checkbox"
              checked={userToEdit?.isAdmin === true ? true : false}
              label="Postavite korisnika za admina?"
            />
          </Form.Group>
          <Button type="submit" variant="dark" className="mt-3">
            Ažurirajte
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default EditUserS;
