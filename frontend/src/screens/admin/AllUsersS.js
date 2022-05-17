import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../features/admin/adminSlice";
import { Table, Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";

const AllUsersS = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const {
    users,
    loading: adminLoading,
    error: adminError,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (user?.isAdmin === false) {
      //not an admin,navigate to home
      return navigate("/");
    }
    dispatch(getAllUsers());
    // eslint-disable-next-line
  }, [dispatch]);

  const handleDelete = (id) => {
    console.log("to do - delete user");
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
            {users?.map((u, idx) => {
              return (
                <tr key={idx}>
                  <td>{u._id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.isAdmin ? (
                      <i className="fas fa-check" style={{ color: "green" }} />
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <Link to={`user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit" />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={handleDelete(user._id)}
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
      ;
    </>
  );
};

export default AllUsersS;
