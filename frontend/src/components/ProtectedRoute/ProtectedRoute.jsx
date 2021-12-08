import { Redirect, Route } from 'react-router-dom';
import { useAppContext } from '../../context/AppContextProvider';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAppContext();

  const isAuthenticated = () => {
    return user.id && user.upi;
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
