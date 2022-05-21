import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser, updateUser } from "../../features/admin/adminSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form, Row } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";

const EditUserS = () => {
  const { id } = useParams();
  //redux toolkit stuff
  const dispatch = useDispatch();
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
      role: "",
    },
  });

  useEffect(() => {
    dispatch(getSingleUser(id));

    // eslint-disable-next-line
  }, [dispatch, id]);

  // useEffect to fill form with fetched values
  useEffect(() => {
    if (userToEdit !== null) {
      const defaults = {
        name: userToEdit?.name,
        email: userToEdit?.email,
        role: userToEdit?.role,
      };
      reset(defaults);
    }
    // eslint-disable-next-line
  }, [userToEdit]);

  const onSubmit = (data) => {
    dispatch(updateUser([id, data]));
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
          <Form.Group>
            {userToEdit?.role !== "admin" && (
              <>
                <Form.Label>Uloga</Form.Label>
                <Form.Select {...register("role")}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </Form.Select>
              </>
            )}
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
