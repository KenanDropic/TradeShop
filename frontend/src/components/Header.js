import { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, logout } from "../features/users/usersSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetOrder } from "../features/orders/ordersSlice";

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
    dispatch(resetOrder()); // reset orders state
    navigate("/");
    toast.success("Odjava uspješna");
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container fluid>
          <LinkContainer to="/">
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
              {user !== null ? (
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

              {user?.isAdmin ? (
                <NavDropdown title="ADMIN">
                  <LinkContainer to="/">
                    <NavDropdown.Item>Korisnici</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/">
                    <NavDropdown.Item>Proizvodi</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/">
                    <NavDropdown.Item>Narudžbe</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link active={false}>
                    <i className="fas fa-user" /> Prijava
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
