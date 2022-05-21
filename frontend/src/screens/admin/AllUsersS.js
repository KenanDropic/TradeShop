import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../../features/admin/adminSlice";
import { Table, Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";

const AllUsersS = () => {
  const dispatch = useDispatch();
  const {
    users,
    loading: adminLoading,
    error: adminError,
    isDeleted,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllUsers());
    // eslint-disable-next-line
  }, [dispatch, isDeleted]);

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati korisnika")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <h2>KORISNICI</h2>
      {adminLoading ? (
        <Loader />
      ) : adminError ? (
        <Message>{adminError}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>IME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 &&
              users?.map((u, idx) => {
                return (
                  <tr key={idx}>
                    <td>{u._id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      {u.role === "admin" ? (
                        <i
                          className="fas fa-check"
                          style={{ color: "green" }}
                        />
                      ) : (
                        <i className="fas fa-times" style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <Link to={`${u._id}/edit`}>
                        <Button variant="light" className="btn-sm">
                          <i className="fas fa-edit" />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => handleDelete(u._id)}
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AllUsersS;
