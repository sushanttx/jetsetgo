import { useSelector } from 'react-redux';

const UserInfo = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="alert alert-info">
        <strong>Not Authenticated</strong> - Please log in to access protected routes.
      </div>
    );
  }

  return (
    <div className="alert alert-success">
      <strong>Authenticated User:</strong>
      <br />
      <strong>Name:</strong> {user?.name}
      <br />
      <strong>Email:</strong> {user?.email}
      <br />
      <strong>Role:</strong> {user?.role}
      <br />
      <strong>ID:</strong> {user?.id}
    </div>
  );
};

export default UserInfo; 