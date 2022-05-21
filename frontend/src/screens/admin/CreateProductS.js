frontend/src/screens/admin/CreateProductS.jsimport { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { createProduct } from "../../features/products/productsSlice";
import { useNavigate } from "react-router-dom";

const CreateProductS = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, isCreated } = useSelector((state) => state.products);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: 0,
      image: "/image/sample.jpg",
      brand: "",
      countInStock: 0,
      category: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isCreated) {
      navigate("/admin/products");
    }
    // eslint-disable-next-line
  }, [isCreated]);

  const onSubmit = (data) => {
    const copyData = {
      name: data.name,
      price: data.price,
      image: `/images/${data.image[0].name}`,
      brand: data.brand,
      countInStock: data.countInStock,
      category: data.category,
      description: data.description,
    };
    dispatch(createProduct(copyData));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="info">{error}</Message>
  ) : (
    <FormContainer>
      <h1>Kreirajte proizvod</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Ime</Form.Label>
          <Form.Control
            {...register("name", {
              required: "Polje je obavezno",
              minLength: {
                value: 3,
                message: "Ime mora biti duže od 3 karaktera",
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
          <Form.Label>Cijena</Form.Label>
          <Form.Control
            {...register("price", {
              required: "Polje je obavezno",
              min: {
                value: 5,
                message: "Vrijednost ne može biti manja od 5",
              },
            })}
            type="number"
            placeholder="0"
          />
          <span style={{ color: "red", display: "block" }}>
            {errors.price?.message}
          </span>
        </Form.Group>
        <Form.Group>
          <Form.Label>Slike</Form.Label>
          <Form.Control
            {...register("image", {
              required: "Polje je obavezno",
            })}
            type="file"
            accept="image/*"
          />
          <span style={{ color: "red", display: "block" }}>
            {errors.image?.message}
          </span>
        </Form.Group>
        <Form.Group>
          <Form.Label>Brand</Form.Label>
          <Form.Control
            {...register("brand", {
              required: "Polje je obavezno",
            })}
            type="text"
            placeholder="Unesite brand"
          />
          <span style={{ color: "red", display: "block" }}>
            {errors.brand?.message}
          </span>
        </Form.Group>
        <Form.Group>
          <Form.Label>Količina</Form.Label>
          <Form.Control
            {...register("countInStock", {
              required: "Polje je obavezno",
              min: {
                value: 5,
                message: "Vrijednost ne može biti manja od 5",
              },
            })}
            type="number"
            placeholder="0"
          />
          <span style={{ color: "red", display: "block" }}>
            {errors.countInStock?.message}
          </span>
        </Form.Group>
        <Form.Group>
          <Form.Label>Kategorija</Form.Label>
          <Form.Control
            {...register("category", {
              required: "Polje je obavezno",
            })}
            type="text"
            placeholder="Unesite kategoriju"
          />
          <span style={{ color: "red", display: "block" }}>
            {errors.category?.message}
          </span>
        </Form.Group>
        <Form.Group>
          <Form.Label>Opis</Form.Label>
          <Form.Control
            {...register("description", {
              required: "Polje je obavezno",
            })}
            type="text"
            placeholder="Unesite opis"
          />
          <span style={{ color: "red", display: "block" }}>
            {errors.description?.message}
          </span>
        </Form.Group>
        <Button type="submit" variant="dark" className="mt-4">
          Kreirajte proizvod
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreateProductS;
