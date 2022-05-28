import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import {
  editProduct,
  getSingleProduct,
} from "../../features/products/productsSlice";
import axios from "axios";

const EditProductS = () => {
  const [imageUrl, setImageUrl] = useState("");
  // eslint-disable-next-line
  const [uploading, setUploading] = useState(false);
  const { id } = useParams();
  //redux toolkit stuff
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((state) => state.products);

  // useForm hook
  const {
    register,
    handleSubmit,
    reset,
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
    dispatch(getSingleProduct(id));

    // eslint-disable-next-line
  }, [dispatch, id]);

  // useEffect to fill form with fetched values
  useEffect(() => {
    if (product !== null) {
      reset(product);
    }
    // eslint-disable-next-line
  }, [loading]);

  // upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/v1/upload", formData, config);
      setImageUrl(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const onSubmit = (data) => {
    // update product
    const copyData = {
      name: data.name,
      price: data.price,
      image: imageUrl === "" ? data.image : imageUrl,
      brand: data.brand,
      countInStock: data.countInStock,
      category: data.category,
      description: data.description,
    };
    dispatch(editProduct([data._id, copyData]));
  };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <FormContainer>
      <h1>Ažurirajte proizvod</h1>
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
          <Form.Label>Slika</Form.Label>
          <Form.Control type="text" defaultValue={product?.image} />
          <Form.Control
            {...register("image")}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
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
                value: 0,
                message: "Vrijednost ne može negativna",
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
          Ažurirajte
        </Button>
      </Form>
    </FormContainer>
  );
};

export default EditProductS;
