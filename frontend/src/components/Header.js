import { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  logout,
  resetUser,
} from "../features/users/usersSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetOrder } from "../features/orders/ordersSlice";
import { resetAdminState } from "../features/admin/adminSlice";
import { resetQuery } from "../features/products/productsSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.users);

  // getting current user if token exist is ls. Value for token state comes from local storage.
  useEffect(() => {
    if (token !== "") {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  const logoutHandler = () => {
    dispatch(logout()); // remove token from storage
    dispatch(resetUser()); // remove token from state
    dispatch(resetOrder()); // reset orders state
    dispatch(resetAdminState()); // reset admin state
    navigate("/");
    toast.success("Odjava uspješna");
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container fluid>
          <LinkContainer to="/" onClick={() => dispatch(resetQuery())}>
            <Navbar.Brand>Trade Shop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link active={false}>
                  <i className="fas fa-shopping-cart" /> Korpa
                </Nav.Link>
              </LinkContainer>
              {user && user !== null ? (
                <NavDropdown title={user?.name}>
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profil</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Odjavite se
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link active={false}>
                    <i className="fas fa-user" /> Prijava
                  </Nav.Link>
                </LinkContainer>
              )}

              {user?.role === "admin" && (
                <NavDropdown title="ADMIN">
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Korisnici</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Proizvodi</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Narudžbe</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
