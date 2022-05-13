import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components/index";

const SharedLayout = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container fluid="xl">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default SharedLayout;
