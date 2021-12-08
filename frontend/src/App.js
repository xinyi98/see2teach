import { Switch, Route, Redirect } from 'react-router-dom';
import GeneralLayout from './components/GeneralLayout';
import Login from './pages/Login/';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Review from './pages/Review';
import RequestReview from './pages/RequestReview';
import MyReviews from './pages/MyReviews';
import RequestedReviews from './pages/RequestedReviews';

const App = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />

      <Route
        exact
        path={['/', '/review/:id', '/request-review', '/my-reviews', '/requested-reviews']}
      >
        <GeneralLayout>
          <ProtectedRoute path="/" exact component={Dashboard} />
          <ProtectedRoute path="/review/:id" component={Review} />
          <ProtectedRoute path="/request-review" component={RequestReview} />
          <ProtectedRoute path="/my-reviews" component={MyReviews} />
          <ProtectedRoute path="/requested-reviews" component={RequestedReviews} />
        </GeneralLayout>
      </Route>

      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default App;
